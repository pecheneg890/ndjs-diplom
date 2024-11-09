import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageDocument } from './schemas/message.schema';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/user/schemas/user.schema';
import { UseGuards } from '@nestjs/common';
import { WebSocketGuard } from 'src/guards/web-socket.guard';
import { SupportRequestService } from './support-request.service';
import { SupportRequestDocument } from './schemas/support-request.schema';

@WebSocketGateway({ withCredentials: true })
export class ChatGateway {
  constructor(private readonly supportRequest: SupportRequestService) {

    //подписка на обновление чата
    this.supportRequest.subscribe(this.sendMessage.bind(this));
  }

  @WebSocketServer()
  server: Server;

  @Roles([Role.client, Role.manager])
  @UseGuards(WebSocketGuard)
  @SubscribeMessage('subscribeToChat')
  handleMessage(@MessageBody() payload: any, @ConnectedSocket() socket): string {
    //присоединение к комнате
    socket.join(payload.chatId);

    return "connected";
  }

  /** Отправка сообщения */
  sendMessage(supportRequest: SupportRequestDocument, message: MessageDocument) {
    const body = {
      id: message._id,
      createdAt: message.sentAt,
      text: message.text,
      readAt: message.readAt,
      author: {
        id: message.author._id,
        name: message.author.name
      }
    };

    this.server.to(supportRequest._id.toString()).emit("message", body);
  }
}
