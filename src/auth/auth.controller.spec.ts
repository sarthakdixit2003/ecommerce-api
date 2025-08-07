import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { User } from 'src/users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('registerUser', () => {
    it('should register a user', async () => {
      const registerDto: RegisterUserDto = { name: 'Test', email: 'test@test.com', password: 'password' };
      const user = new User();
      mockAuthService.registerUser.mockResolvedValue(user);

      const result = await controller.registerUser(registerDto);

      expect(result).toEqual(user);
      expect(mockAuthService.registerUser).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('loginUser', () => {
    it('should log in a user and return tokens', async () => {
      const loginDto: LoginUserDto = { email: 'test@test.com', password: 'password' };
      const tokens = { access_token: 'access', refresh_token: 'refresh' };
      mockAuthService.loginUser.mockResolvedValue(tokens);

      const result = await controller.loginUser(loginDto);

      expect(result).toEqual(tokens);
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(loginDto);
    });
  });
});