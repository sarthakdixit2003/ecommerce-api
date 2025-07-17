import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService
  ) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  async getAllUsers(): Promise<(User | undefined)[]> {
    return await this.usersService.getAllUsers();
  }
}
