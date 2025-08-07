import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { passwordService } from './password.service';
import { User } from '../users/entities/user.entity';
import { UnauthorizedException, InternalServerErrorException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let refreshJwtService: JwtService;
  let passService: passwordService;

  const mockUsersService = {
    createUser: jest.fn(),
    getOneUserByField: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockPasswordService = {
    createHash: jest.fn(),
    comparePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: 'REFRESH_JWT_SERVICE', useValue: mockJwtService },
        { provide: passwordService, useValue: mockPasswordService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    refreshJwtService = module.get<JwtService>('REFRESH_JWT_SERVICE');
    passService = module.get<passwordService>(passwordService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('registerUser', () => {
    it('should hash the password and save the new user', async () => {
      const registerDto = { name: 'Test', email: 'test@test.com', password: 'password' };
      const hashedPassword = 'hashedPassword';
      const user = new User();
      mockPasswordService.createHash.mockResolvedValue(hashedPassword);
      mockUsersService.createUser.mockResolvedValue(user);

      const result = await service.registerUser(registerDto);

      expect(mockPasswordService.createHash).toHaveBeenCalledWith(registerDto.password);
      expect(mockUsersService.createUser).toHaveBeenCalledWith({ name: registerDto.name, email: registerDto.email, passwordHash: hashedPassword });
      expect(result).toEqual(user);
    });

    it('should throw InternalServerErrorException if user creation fails', async () => {
        const registerDto = { name: 'Test', email: 'test@test.com', password: 'password' };
        mockPasswordService.createHash.mockResolvedValue('hashedPassword');
        mockUsersService.createUser.mockRejectedValue(new Error());

        await expect(service.registerUser(registerDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('loginUser', () => {
    it('should return tokens for valid credentials', async () => {
      const loginDto = { email: 'test@test.com', password: 'password' };
      const user = { id: '1', email: 'test@test.com', name: 'Test', role: 'user', passwordHash: 'hashed' } as User;
      const accessToken = 'access_token';
      const refreshToken = 'refresh_token';

      mockUsersService.getOneUserByField.mockResolvedValue(user);
      mockPasswordService.comparePassword.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValueOnce(accessToken).mockResolvedValueOnce(refreshToken);

      const result = await service.loginUser(loginDto);

      expect(result).toEqual({ access_token: accessToken, refresh_token: refreshToken });
      expect(mockUsersService.getOneUserByField).toHaveBeenCalledWith(loginDto.email, 'email');
      expect(mockPasswordService.comparePassword).toHaveBeenCalledWith(loginDto.password, user.passwordHash);
    });

    it('should throw UnauthorizedException for invalid user', async () => {
        const loginDto = { email: 'test@test.com', password: 'password' };
        mockUsersService.getOneUserByField.mockResolvedValue(null);

        await expect(service.loginUser(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
        const loginDto = { email: 'test@test.com', password: 'password' };
        const user = { passwordHash: 'hashed' } as User;
        mockUsersService.getOneUserByField.mockResolvedValue(user);
        mockPasswordService.comparePassword.mockResolvedValue(false);

        await expect(service.loginUser(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
