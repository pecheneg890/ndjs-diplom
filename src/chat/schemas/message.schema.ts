import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserDocument } from 'src/user/schemas/user.schema';

export type MessageDocument = HydratedDocument<Message>;


@Schema()
export class Message {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    author: UserDocument;

    @Prop({ required: true })
    sentAt: Date;

    @Prop({ required: true })
    text: string;

    @Prop()
    readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
