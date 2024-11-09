import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ReservationCreateDto {
	@IsString()
	@IsNotEmpty()
	hotelRoom: string;

	@IsDate()
	@Type(() => Date)
	@IsNotEmpty()
	startDate: Date;

	@IsDate()
	@Type(() => Date)
	@IsNotEmpty()
	endDate: Date;
}
