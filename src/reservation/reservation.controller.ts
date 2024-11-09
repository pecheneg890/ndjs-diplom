import {
	Controller,
	Get,
	Post,
	Delete,
	Patch,
	Body,
	Param,
	Query,
	UsePipes,
	ValidationPipe,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { BOOKING_NOT_FOUND } from './reservation.constants';
import { ReservationCreateDto } from './dto/reservation-create.dto';
import { ReservationService } from './reservation.service';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../user/schemas/user.schema';
import { User } from '../decorators/user.decorator';
import { IReqUser } from 'src/common/common.interfaces';

@Controller()
export class ReservationController {
	constructor(private readonly reservationService: ReservationService) { }

	@Post('client/reservations')
	@Roles([Role.client])
	@UsePipes(new ValidationPipe({ transform: true }))
	async addReservation(@Body() dto: ReservationCreateDto, @User() user: IReqUser) {
		const reservation = await this.reservationService.addReservation({
			roomId: dto.hotelRoom,
			dateStart: dto.startDate,
			dateEnd: dto.endDate,
			userId: user.id
		});

		return {
			startDate: reservation.dateStart,
			endDate: reservation.dateEnd,
			hotelRoom: {
				description: reservation.roomId.description,
				images: reservation.roomId.images
			},
			hotel: {
				title: reservation.hotelId.title,
				description: reservation.hotelId.description
			}
		};
	}

	@Get('client/reservations')
	@Roles([Role.client])
	async getClientReservations(@User() user: IReqUser) {
		const reservations = await this.reservationService.getReservations({ userId: user.id });

		return reservations.map(el => ({
			startDate: el.dateStart,
			endDate: el.dateEnd,
			hotelRoom: {
				description: el.roomId.description,
				images: el.roomId.images
			},
			hotel: {
				title: el.hotelId.title,
				description: el.hotelId.description
			}
		})
		);
	}

	@Delete('client/reservations/:id')
	@Roles([Role.client])
	async deleteClientReservation(@Param('id') id: string, @User() user: IReqUser) {
		const reservation = await this.reservationService.getById(id);

		if (reservation.userId._id.toString() !== user.id) { throw new ForbiddenException(); }

		await this.reservationService.removeReservation(id);
	}

	@Get('manager/reservations/:id')
	@Roles([Role.manager])
	async getReservations(@Param('id') userId: string) {
		const reservations = await this.reservationService.getReservations({ userId: userId });

		return reservations.map(el => ({
			startDate: el.dateStart,
			endDate: el.dateEnd,
			hotelRoom: {
				description: el.roomId.description,
				images: el.roomId.images
			},
			hotel: {
				title: el.hotelId.title,
				description: el.hotelId.description
			}
		})
		);
	}

	@Delete('manager/reservations/:id')
	@Roles([Role.manager])
	async deleteReservation(@Param('id') reservationId: string) {
		await this.reservationService.removeReservation(reservationId);
	}
}
