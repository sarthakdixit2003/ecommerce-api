import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { RolesGuard } from 'src/auth/roles.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    getAllUsers: jest.fn(),
  };

  const mockRolesGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    })
    .overrideGuard(RolesGuard)
    .useValue(mockRolesGuard)
    .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const expectedUsers: User[] = [new User()];
      mockUsersService.getAllUsers.mockResolvedValue(expectedUsers);

      const result = await controller.getAllUsers();

      expect(result).toEqual(expectedUsers);
      expect(mockUsersService.getAllUsers).toHaveBeenCalled();
    });
  });
});
