import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService
    ) {}
    async registerUser(dto: RegisterUserDto) {
        try{
            console.log(dto);
            this.userService.registerUser(dto);
        } catch(error: any) {
            console.log(error);
        }
    }
}
