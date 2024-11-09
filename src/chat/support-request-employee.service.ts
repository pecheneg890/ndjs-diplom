import { Injectable, NotFoundException } from '@nestjs/common';
import { ISupportRequestEmployeeService, MarkMessagesAsReadDto } from './chat.interfaces';
import { ID } from 'src/common/common.types';
import { SupportRequest, SupportRequestDocument } from './schemas/support-request.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CHAT_NOT_FOUND } from './chat.constants';
import { Role } from 'src/user/schemas/user.schema';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class SupportRequestEmployeeService implements ISupportRequestEmployeeService {
    constructor(@InjectModel(SupportRequest.name) private supportRequestModel: Model<SupportRequestDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>) {
    }

    async markMessagesAsRead(params: MarkMessagesAsReadDto) {
        const supportRequest = await this.supportRequestModel.findById(params.supportRequest)
            .populate('messages')
            .populate('messages.author')
            .exec();

        if (!supportRequest) throw new NotFoundException(CHAT_NOT_FOUND);

        for (const message of supportRequest.messages) {
            if (params.createdBefore >= message.sentAt &&
                message.author.role === Role.client &&
                !message.readAt
            ) {
                await this.messageModel.findByIdAndUpdate(message._id, { readAt: new Date() }).exec();
            }
        }
    }

    async getUnreadCount(supportRequest: ID): Promise<number> {
        const request = await this.supportRequestModel.findById(supportRequest)
            .populate('messages')
            .populate('author')
            .exec();

        if (!request) throw new NotFoundException(CHAT_NOT_FOUND);
        return request.messages.reduce((cum, el) =>
            (!el.readAt && el.author.role === Role.client ? cum + 1 : cum), 0);
    }


    async closeRequest(supportRequest: ID): Promise<void> {
        const request = await this.supportRequestModel.findById(supportRequest)
        if (!request) throw new NotFoundException(CHAT_NOT_FOUND);

        request.isActive = false;
        await this.supportRequestModel.findByIdAndUpdate(supportRequest, request);
    }
}
