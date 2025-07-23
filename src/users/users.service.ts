import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createUserInput } from './interface/create-user.input';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new user in the database.
   *
   * @param input - Object containing email, name, and passwordHash
   * @param input.email - The user's email address
   * @param input.name - The user's full name
   * @param input.passwordHash - The bcrypt-hashed password
   * @returns The newly created User entity (including generated id and timestamps)
   * @throws InternalServerErrorException if the user could not be created
   */
  async createUser(input: createUserInput): Promise<User> {
    try {
      const newUser = await this.userRepository.save(input);
      return newUser;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.stack}`);
      throw new InternalServerErrorException('User could not be created');
    }
  }

  /**
   *
   * @param input
   * @param type
   * @returns User object if found in database, otherwise null
   */
  async getOneUserByField(input: string, type: 'email' | 'id'): Promise<User | null> {
    try {
      const user = await this.userRepository.findOneBy({ [type]: input });
      this.logger.log(`User found with ${type}: ${input}`);
      return user;
    } catch (error) {
      this.logger.error(`Failed to find user: ${error.stack}`);
      throw new InternalServerErrorException(`Could not find user with ${type}: ${input}`);
    }
  }

  /**
   * Requires admin permission
   * @returns List of all users
   */
  async getAllUsers(): Promise<Partial<User[]>> {
    try {
      const users = await this.userRepository.find();
      return users;
    } catch(error) {
      this.logger.error(`Internal Server Error: ${error.stack}`);
      throw new InternalServerErrorException();
    }
  }
}
