import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { loginUserInterface } from './interfaces/login-user.interface';
import { IsPublic } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) {
  }

  @IsPublic()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  registerUser(@Body() dto: RegisterUserDto): Promise<Partial<User>> {
    return this.authService.registerUser(dto);
  }

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  loginUser(@Body() dto: LoginUserDto): Promise<loginUserInterface> {
    return this.authService.loginUser(dto);
  }
}
