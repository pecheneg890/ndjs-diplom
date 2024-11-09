import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { GetChatListParams, ISupportRequestService, SendMessageDto } from './chat.interfaces';
import { ID } from 'src/common/common.types';
import { Message, MessageDocument } from './schemas/message.schema';
import { SupportRequest, SupportRequestDocument } from './schemas/support-request.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CHAT_NOT_FOUND } from './chat.constants';
import { Types } from "mongoose";
import { ChatGateway } from './chat.gateway';
import { IReqUser } from 'src/common/common.interfaces';
import { Role } from 'src/user/schemas/user.schema';

@Injectable()
export class SupportRequestService implements ISupportRequestService {
    messageSubscribers;

    constructor(
        @InjectModel(SupportRequest.name) private supportRequestModel: Model<SupportRequestDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>) {
        this.messageSubscribers = [];
    }

    findSupportRequests(params: GetChatListParams): Promise<SupportRequestDocument[]> {
        return this.supportRequestModel.find({
            ...params.user ? { user: params.user } : {},
            isActive: params.isActive
        }).skip(params.offset).limit(params.limit).populate('messages').populate('user').exec();
    }

    async sendMessage(data: SendMessageDto): Promise<MessageDocument> {
        const supportRequest = await this.supportRequestModel.findById(data.supportRequest);

        if (!supportRequest) throw new NotFoundException(CHAT_NOT_FOUND);

        const newMessage = new this.messageModel({
            author: data.author,
            sentAt: new Date(),
            text: data.text,
        });
        const message = await (await newMessage.save()).populate('author');

        supportRequest.messages.push(message);
        await this.supportRequestModel.findByIdAndUpdate(data.supportRequest, supportRequest);

        for (const subscriber of this.messageSubscribers) {
            subscriber(supportRequest, message);
        }
        return message;
    }

    async getMessages(supportRequest: ID): Promise<MessageDocument[]> {
        const request = await this.supportRequestModel.findById(supportRequest)
            .select('messages')
            .populate({ path: 'messages', populate: { path: 'author' } })
            .exec();
        if (!request) throw new NotFoundException(CHAT_NOT_FOUND);

        return request.messages;
    }


    subscribe(handler: (supportRequest: SupportRequestDocument, message: MessageDocument) => void): () => void {
        this.messageSubscribers.push(handler);
        return () => { };
    }

    async getRequest(supportRequest: ID): Promise<SupportRequestDocument> {
        const request = await this.supportRequestModel.findById(supportRequest);
        if (!request) throw new NotFoundException(CHAT_NOT_FOUND);
        return request;
    }


    async checkAuthor(user: IReqUser, supportRequest: ID) {
        if (user.role !== Role.client) return;

        const request = await this.getRequest(supportRequest);
        if (request.user._id.toString() !== user.id) {
            throw new ForbiddenException();
        }
    }
}
