import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { MessageDocument } from './message.schema';
import { UserDocument } from 'src/user/schemas/user.schema';

export type SupportRequestDocument = HydratedDocument<SupportRequest>;


@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class SupportRequest {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    user: UserDocument;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
    messages: MessageDocument[];

    @Prop()
    isActive: boolean;

    createdAt: Date;
}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest);
