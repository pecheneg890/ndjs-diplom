import { IsNumber, Min, IsString, IsEnum, IsBoolean, IsNotEmpty } from 'class-validator';

export class HotelUpdateDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	description: string;
}
