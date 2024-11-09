import { Injectable, ExecutionContext, CanActivate, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/user/schemas/user.schema';
import { WsException } from '@nestjs/websockets';
import { UserService } from 'src/user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { SupportRequest, SupportRequestDocument } from 'src/chat/schemas/support-request.schema';
import { Model } from 'mongoose';


@Injectable()
export class WebSocketGuard implements CanActivate {
    constructor(private reflector: Reflector,
        private readonly userService: UserService,
        @InjectModel(SupportRequest.name) private supportRequestModel: Model<SupportRequestDocument>,
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs().getClient();
        const handshake = client.handshake;
        const user = handshake?.session?.passport?.user;

        //считываем значение ролей из декоратора
        const requiredRole = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);


        if (!requiredRole) {
            return true;
        }

        //пользователь не аутентифицирован
        if (!user) {
            throw new WsException('Unauthorized');
        }

        //Проверяем есть ли такая роль у пользователя
        const userData = await this.userService.findByEmail(user);
        if (!requiredRole.includes(userData.role)) {
            throw new WsException('Forbidden');
        }

        //Если менеджер, то есть полномочия
        if (userData.role === Role.manager) return true;

        //Если не менеджер, то проверяем что пользователь создатель чата
        const payload = context.switchToWs().getData();
        const chatId = payload?.chatId;

        const chatData = await this.supportRequestModel.findById(chatId).populate('user').exec();
        if (!chatData) throw new WsException('Chat not found');

        if (chatData.user.email !== user)
            throw new WsException('Forbidden user is not author');

        return true;
    }
}
