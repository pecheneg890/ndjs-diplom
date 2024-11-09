import { ID } from "src/common/common.types";
import { SupportRequestDocument } from "./schemas/support-request.schema";
import { MessageDocument } from "./schemas/message.schema";

export interface CreateSupportRequestDto {
    user: ID;
    text: string;
}

export interface SendMessageDto {
    author: ID;
    supportRequest: ID;
    text: string;
}

export interface MarkMessagesAsReadDto {
    user: ID;
    supportRequest: ID;
    createdBefore: Date;
}

export interface GetChatListParams {
    user: ID | null;
    isActive: boolean;
    limit: number;
    offset: number;
}

export interface ISupportRequestService {
    findSupportRequests(params: GetChatListParams): Promise<SupportRequestDocument[]>;
    sendMessage(data: SendMessageDto): Promise<MessageDocument>;
    getMessages(supportRequest: ID): Promise<MessageDocument[]>;
    subscribe(
        handler: (supportRequest: SupportRequestDocument, message: MessageDocument) => void
    ): () => void;
}

export interface ISupportRequestClientService {
    createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequestDocument>;
    markMessagesAsRead(params: MarkMessagesAsReadDto);
    getUnreadCount(supportRequest: ID): Promise<number>;
}

export interface ISupportRequestEmployeeService {
    markMessagesAsRead(params: MarkMessagesAsReadDto);
    getUnreadCount(supportRequest: ID): Promise<number>;
    closeRequest(supportRequest: ID): Promise<void>;
}