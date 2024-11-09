import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IHotelService, SearchHotelParams, UpdateHotelParams } from './hotel.interface';
import { Hotel, HotelDocument } from './schemas/hotel.schema';
import { ID } from 'src/common/common.types';
import { HOTEL_NOT_FOUND } from './hotel.constants';

@Injectable()
export class HotelService implements IHotelService {
	constructor(@InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>) { }

	async create(data: any): Promise<HotelDocument> {
		return this.hotelModel.create(data);
	}

	async findById(id: ID): Promise<HotelDocument> {
		const hotel = await this.hotelModel.findById(id).exec();
		if (!hotel) throw new NotFoundException(HOTEL_NOT_FOUND);
		return hotel;
	}

	async search(params: SearchHotelParams): Promise<HotelDocument[]> {
		return this.hotelModel.find({
			title: { $regex: params.title }
		}).sort('_id').skip(params.offset).limit(params.limit).exec();

	}

	async update(id: ID, data: UpdateHotelParams): Promise<HotelDocument> {
		const hotel = await this.hotelModel.findByIdAndUpdate(id, data, { new: true }).exec();
		if (!hotel) throw new NotFoundException(HOTEL_NOT_FOUND);
		return hotel;
	}
}
