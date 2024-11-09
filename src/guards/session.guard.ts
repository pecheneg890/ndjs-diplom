import { Injectable, ExecutionContext, CanActivate, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/user/schemas/user.schema';


@Injectable()
export class SessionGuard implements CanActivate {
    constructor(private reflector: Reflector) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();

        //считываем значение ролей из декоратора
        const requiredRole = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRole) {
            return true;
        }

        if (!request?.user) {
            throw new UnauthorizedException();
        }

        if (!requiredRole.includes(request.user.role)) {
            throw new ForbiddenException();
        }
        return true;
    }
}
