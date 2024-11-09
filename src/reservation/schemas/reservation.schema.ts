import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { HotelRoomDocument } from 'src/hotel/schemas/hotel-room.schema';
import { HotelDocument } from 'src/hotel/schemas/hotel.schema';
import { UserDocument } from 'src/user/schemas/user.schema';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema()
export class Reservation {
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
	userId: UserDocument;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true })
	hotelId: HotelDocument;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'HotelRoom', required: true })
	roomId: HotelRoomDocument

	@Prop({ required: true })
	dateStart: Date;

	@Prop({ required: true })
	dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
