import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { createUserInput } from './interface/create-user.input';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUserRepository = {
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const createUserInput: createUserInput = { email: 'test@example.com', name: 'Test User', passwordHash: 'hashedpassword' };
      const expectedUser = new User();
      mockUserRepository.save.mockResolvedValue(expectedUser);

      const result = await service.createUser(createUserInput);

      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.save).toHaveBeenCalledWith(createUserInput);
    });
  });

  describe('getOneUserByField', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const expectedUser = new User();
      mockUserRepository.findOneBy.mockResolvedValue(expectedUser);

      const result = await service.getOneUserByField(email, 'email');

      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ email });
    });

    it('should return a user by id', async () => {
      const id = 'some-uuid';
      const expectedUser = new User();
      mockUserRepository.findOneBy.mockResolvedValue(expectedUser);

      const result = await service.getOneUserByField(id, 'id');

      expect(result).toEqual(expectedUser);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const expectedUsers: User[] = [new User()];
      mockUserRepository.find.mockResolvedValue(expectedUsers);

      const result = await service.getAllUsers();

      expect(result).toEqual(expectedUsers);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });
});
