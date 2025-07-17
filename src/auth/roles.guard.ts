import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);
 
  constructor(
    private usersService: UsersService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
			const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
				context.getHandler(),
				context.getClass(),
			]);

			if(!roles) {
				return true;
			}

      const request = context.switchToHttp().getRequest();
      const user = request['user'];

			if(!user?.role || !roles.includes(user.role)) {
				throw new ForbiddenException(`Requires one of roles [${roles.join(', ')}], your role: ${user.role ?? 'none'}`);
			}
      return true;
    } catch (error) {
			if(error instanceof ForbiddenException) {
				this.logger.error(`Forbidden`);
				throw error;
			}
      this.logger.error(`Internal Server Error: ${error.stack}`);
      throw new InternalServerErrorException();
    }
  }
}
