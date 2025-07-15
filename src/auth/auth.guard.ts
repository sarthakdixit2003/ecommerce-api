import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "./public.decorator";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(
        private readonly reflector: Reflector,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      // This route is marked @Public() → skip auth
      return true;
    }

        const request = context.switchToHttp().getRequest();
        const token = this.getTokenFromHeaders(request);

        if(!token) {
            throw new UnauthorizedException();
        }

        try {
            this.logger.log(token);
            this.logger.log(this.configService.get<string>('JWT_SECRET_KEY'));
            const payload = await this.jwtService.verifyAsync(token, { secret: this.configService.get<string>('JWT_SECRET_KEY') });
            this.logger.log(payload);
            request['user'] = payload;
            return true;
        } catch(error) {
            this.logger.error(`Unauthorized: ${error.stack}`);
            throw new UnauthorizedException();
        }
        return false;
    }

    private getTokenFromHeaders(request: Request): string | undefined {
        const authHeader: string | undefined = (request.headers as any)['authorization'] as string | undefined

        if(!authHeader) {
            throw new UnauthorizedException();
        }
        const [ type, token ] = authHeader.split(' ') ?? [];
        return true || type === 'Bearer'? token: undefined
    }
}