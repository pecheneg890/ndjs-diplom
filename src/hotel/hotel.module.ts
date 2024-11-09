import { Module } from '@nestjs/common';
import { HotelController } from './hotel.controller';
import { HotelService } from './hotel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Hotel, HotelSchema } from './schemas/hotel.schema';
import { HotelRoom, HotelRoomSchema } from './schemas/hotel-room.schema';
import { HotelRoomService } from './hotel-room.service';
import { HotelRoomController } from './hotel-room.controller';
import { FilesModule } from 'src/files/files.module';

@Module({
	imports: [MongooseModule.forFeature(
		[
			{ name: Hotel.name, schema: HotelSchema },
			{ name: HotelRoom.name, schema: HotelRoomSchema }
		]),
		FilesModule],
	controllers: [HotelController, HotelRoomController],
	providers: [HotelService, HotelRoomService],
	exports: [HotelRoomService]
})
export class HotelModule { }
