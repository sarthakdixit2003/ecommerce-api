import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { passwordService } from './password.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private passwordService: passwordService,
    @Inject('REFRESH_JWT_SERVICE') private readonly refreshJwtService: JwtService,
  ) {}

  /**
   * Registers user by creating a password hash
   * @param dto - RegisterUserDto containing email, password, name
   * @returns Newly created User without passwordHash
   * @throws InternalServerErrorException if the user could not be created
   */
  async registerUser(dto: RegisterUserDto): Promise<Partial<User>> {
    try {
      const { password, ...userDetails } = dto;
      const passwordHash = await this.passwordService.createHash(password);
      const newUser = await this.userService.createUser({ ...userDetails, passwordHash });

      this.logger.log(`Registered User Successfully: ${newUser.id}`);
      const { passwordHash: _omit, ...safeUser } = newUser;
      return safeUser;
    } catch (error) {
      this.logger.error(`Failed to register user: ${error.stack}`);
      throw new InternalServerErrorException('User could not be created');
    }
  }

  /**
   *
   * @param dto - containing email and password
   * @returns JWT token
   * @throws UnauthhorizedException for invalid credentials
   * @throws InternalServerErrorException otherwise
   */
  async loginUser(dto: LoginUserDto) {
    try {
      const { email, password } = dto;
      const user = await this.userService.getOneUserByField(email, 'email');
      const isValid = await this.passwordService.comparePassword(
        password,
        user?.passwordHash ?? '',
      );

      if (!user || !isValid) {
        throw new UnauthorizedException();
      }

      const payload = { id: user.id, email: user.email, name: user.name, role: user.role };
      const jwtToken = await this.jwtService.signAsync(payload);
      const refreshToken = await this.refreshJwtService.signAsync(payload);
      
      return { access_token: jwtToken, refresh_token: refreshToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Unable to login: ${error.stack}`);
      throw new InternalServerErrorException(error.message);
    }
  }
}
