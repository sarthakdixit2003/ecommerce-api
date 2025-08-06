import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";

// Ensure route decorated with this guard contains "userId" param
@Injectable()
export class OrderOwnershipGuard implements CanActivate {
    constructor() {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const paramsUserId: string = request.params.userId;

        if(user?.role !== 'admin' || user.id !== paramsUserId) {
            throw new ForbiddenException(`You are not allowed to access this resource`);
        }
        return true;
    }
}