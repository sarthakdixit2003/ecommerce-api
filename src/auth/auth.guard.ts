import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './public.decorator';
import { Reflector } from '@nestjs/core';
import { getTokenFromHeaders } from './utils';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private readonly jwtSecretKey: string | undefined;

  constructor(
    private readonly reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.jwtSecretKey = this.configService.get<string>('JWT_SECRET_KEY')
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = getTokenFromHeaders(request);

    if (!token) {
      throw new UnauthorizedException(`No Bearer token provided`);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecretKey,
      });
      request['user'] = payload;
      return true;
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        this.logger.warn(`Auth failed: ${error.message}`);
        throw new UnauthorizedException('Invalid token');
      }
      this.logger.error(`Unauthorized: ${error.stack}`);
      throw new UnauthorizedException();
    }
  }
}
