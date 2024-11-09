import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { HotelModule } from 'src/hotel/hotel.module';

@Module({
	imports: [MongooseModule.forFeature([{ name: Reservation.name, schema: ReservationSchema }]),
		HotelModule],
	controllers: [ReservationController],
	providers: [ReservationService],
})
export class ReservationModule { }
