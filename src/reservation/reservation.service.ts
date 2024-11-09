import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Reservation, ReservationDocument } from './schemas/reservation.schema';
import { Model, Query, RootFilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ALREADY_BOOKED, RESERVATION_NOT_FOUND, ROOM_NOT_FOUND } from './reservation.constants';
import { IReservation, ReservationDto, ReservationSearchOptions } from './reservation.interface';
import { ID } from 'src/common/common.types';
import { HotelRoomService } from 'src/hotel/hotel-room.service';

@Injectable()
export class ReservationService implements IReservation {
	constructor(@InjectModel(Reservation.name) private reservationModel: Model<ReservationDocument>,
		private readonly hotelRoomService: HotelRoomService) { }


	async addReservation(data: ReservationDto): Promise<ReservationDocument> {
		//проверка сущестования номера
		const room = await this.hotelRoomService.findById(data.roomId);
		if (!room || room.isEnabled !== true) {
			throw new BadRequestException(ROOM_NOT_FOUND);
		}

		//проверка что номер еще не забронирован
		const existReservation = await this.reservationModel.findOne({
			roomId: data.roomId,
			dateEnd: {
				$gte: data.dateStart
			},
			dateStart: {
				$lte: data.dateEnd
			}
		}).exec();
		if (existReservation) throw new BadRequestException(ALREADY_BOOKED);


		const newReserv = new this.reservationModel({
			...data,
			hotelId: room.hotel._id,
		});

		return await (await (await newReserv.save()).populate('hotelId')).populate('roomId');
	}


	async removeReservation(id: ID): Promise<void> {
		const deleted = await this.reservationModel.findByIdAndDelete(id);
		if (!deleted) throw new NotFoundException(RESERVATION_NOT_FOUND);
		return;
	}

	getReservations(filter: ReservationSearchOptions): Promise<Array<ReservationDocument>> {
		const search: RootFilterQuery<ReservationDocument> = {
			userId: filter.userId
		};

		if (filter.dateStart)
			search.dateEnd = { $ge: filter.dateStart };

		if (filter.dateEnd)
			search.dateStart = { $le: filter.dateEnd };

		return this.reservationModel.find(search).populate('hotelId').populate('roomId').exec();
	}

	async getById(id: ID): Promise<ReservationDocument> {
		const reservation = await this.reservationModel.findById(id);
		if (!reservation) throw new BadRequestException(RESERVATION_NOT_FOUND);
		return reservation;
	}
}
