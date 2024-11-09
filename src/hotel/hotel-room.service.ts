import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HotelRoomCreation, HotelRoomUpdate, IHotelRoomService, SearchRoomsParams, SearchRoomsParamsModel } from './hotel.interface';
import { ID } from 'src/common/common.types';
import { HOTEL_ROOM_NOT_FOUND } from './hotel.constants';
import { HotelRoom, HotelRoomDocument } from './schemas/hotel-room.schema';

@Injectable()
export class HotelRoomService implements IHotelRoomService {
    constructor(@InjectModel(HotelRoom.name) private hotelRoomModel: Model<HotelRoomDocument>) { }

    async create(data: HotelRoomCreation): Promise<HotelRoomDocument> {
        return (await this.hotelRoomModel.create(data)).populate('hotel');
    }

    async findById(id: ID): Promise<HotelRoomDocument> {
        const hotelRoom = await this.hotelRoomModel.findById(id).exec();
        if (!hotelRoom) throw new NotFoundException(HOTEL_ROOM_NOT_FOUND);
        return hotelRoom;
    }

    async search(params: SearchRoomsParams): Promise<HotelRoomDocument[]> {
        const searchParam: SearchRoomsParamsModel = {
            hotel: params.hotel
        };

        if (params.isEnabled !== undefined) {
            searchParam.isEnabled = params.isEnabled;
        }

        return this.hotelRoomModel.find(searchParam).skip(params.offset).limit(params.limit).exec();
    }

    async update(id: ID, data: HotelRoomUpdate): Promise<HotelRoomDocument> {
        const hotelRoom = await this.hotelRoomModel.findByIdAndUpdate(id, data, { new: true }).populate('hotel').exec();
        if (!hotelRoom) throw new NotFoundException(HOTEL_ROOM_NOT_FOUND);
        return hotelRoom;
    }
}
