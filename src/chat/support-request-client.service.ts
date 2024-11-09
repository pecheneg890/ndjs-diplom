import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSupportRequestDto, ISupportRequestClientService, MarkMessagesAsReadDto } from './chat.interfaces';
import { ID } from 'src/common/common.types';
import { SupportRequest, SupportRequestDocument } from './schemas/support-request.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CHAT_NOT_FOUND } from './chat.constants';
import { UserService } from 'src/user/user.service';
import { Role } from 'src/user/schemas/user.schema';

@Injectable()
export class SupportRequestClientService implements ISupportRequestClientService {
    constructor(
        @InjectModel(SupportRequest.name) private supportRequestModel: Model<SupportRequestDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        private readonly userService: UserService) { }

    async createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequestDocument> {
        const message = await this.messageModel.create({
            author: data.user,
            sentAt: new Date(),
            text: data.text,
        });

        const supportRequest = new this.supportRequestModel({
            user: data.user,
            messages: [message._id],
            isActive: true
        });

        return (await supportRequest.save()).populate('messages');
    }

    async markMessagesAsRead(params: MarkMessagesAsReadDto) {
        const supportRequest = await this.supportRequestModel.findById(params.supportRequest)
            .populate('messages')
            .exec();

        if (!supportRequest) throw new NotFoundException(CHAT_NOT_FOUND);

        const user = await this.userService.findById(params.user);

        //Пользователь с ролью user может отмечать прочтение только в своих обращениях
        if (user.role === Role.client && supportRequest.user._id.toString() !== user._id.toString()) {
            throw new ForbiddenException();
        }

        for (const message of supportRequest.messages) {
            if (params.createdBefore >= message.sentAt &&
                message.author._id.toString() !== user._id.toString() &&
                !message.readAt
            ) {
                await this.messageModel.findByIdAndUpdate(message._id, { readAt: new Date() }).exec();
            }
        }
    }

    async getUnreadCount(supportRequest: ID): Promise<number> {
        const request = await this.supportRequestModel.findById(supportRequest)
            .populate({ path: 'messages', populate: 'author' })
            .exec();

        if (!request) throw new NotFoundException(CHAT_NOT_FOUND);
        return request.messages.reduce((cum, el) =>
            (!el.readAt && el.author.role !== Role.client ? cum + 1 : cum), 0);
    }
}
