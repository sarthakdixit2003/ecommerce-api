import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/users/dtos/register-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  registerUser(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
  }
}
