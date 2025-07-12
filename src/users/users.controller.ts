import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from './dtos/register-user.dto';

@Controller('users')
export class UsersController {
    @Post()
    getAllUsers(@Body() body: RegisterUserDto): string {
        return 'Hello from users!';
    }
}
