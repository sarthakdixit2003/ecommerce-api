import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dtos/register-user.dto';

@Injectable()
export class UsersService {
    constructor (
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async registerUser(dto: RegisterUserDto): Promise<void> {
        await this.userRepository.save(dto);
    }
}
