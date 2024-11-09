import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { SupportRequestService } from './support-request.service';
import { SupportRequestClientService } from './support-request-client.service';
import { SupportRequestEmployeeService } from './support-request-employee.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';
import { SupportRequest, SupportRequestSchema } from './schemas/support-request.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:
    [MongooseModule.forFeature(
      [
        { name: Message.name, schema: MessageSchema },
        { name: SupportRequest.name, schema: SupportRequestSchema }
      ]),
      UserModule],
  providers: [ChatGateway, SupportRequestService, SupportRequestClientService, SupportRequestEmployeeService],
  controllers: [ChatController]
})
export class ChatModule { }
