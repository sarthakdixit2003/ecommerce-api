import { Module, Provider } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { passwordService } from './password.service';
import { ConfigService } from '@nestjs/config';

export const RefreshTokenService: Provider = {
  provide: 'REFRESH_JWT_SERVICE',
  useFactory: (config: ConfigService) => {
    return new JwtService({
      secret: config.get<string>('JWT_REFRESH_SECRET_KEY'),
      signOptions: { expiresIn: config.get<string>('JWT_REFRESH_EXPIRE_TIME') }
    });
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    UsersModule, 
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.get<string>('JWT_SECRET_KEY'),
          signOptions: { expiresIn: config.get<string>('JWT_EXPIRY_TIME') }
        }
      },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshTokenService, passwordService],
  exports: [RefreshTokenService]
})
export class AuthModule {}
