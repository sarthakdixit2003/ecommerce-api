import { Controller, Get, Request, UseGuards } from '@nestjs/common';

@Controller('users')
export class UsersController {
    @Get()
    getAllUsers(@Request() request: Request): string {
        return 'Hello from users!';
    }
}
