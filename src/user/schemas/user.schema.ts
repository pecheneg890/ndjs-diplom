import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Role {
	admin = 'admin',
	client = 'client',
	manager = 'manager'
}

@Schema()
export class User {
	@Prop({ required: true, unique: true })
	email: string;

	@Prop({ required: true })
	passwordHash: string;

	@Prop({ required: true })
	name: string;

	@Prop()
	contactPhone: string;

	@Prop({ required: true, enum: Role, default: Role.client })
	role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
