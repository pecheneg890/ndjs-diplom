import { Transform, Type, plainToInstance } from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';

export class HotelRoomUpdateDto {
	@IsString()
	@IsNotEmpty()
	description: string;

	@IsString()
	@IsNotEmpty()
	hotelId: string;

	@IsBoolean()
	@IsNotEmpty()
	@Transform(({ value }) => value === 'true')
	isEnabled: boolean;

	@IsArray()
	@IsString({ each: true })
	@Transform(({ value }) => JSON.parse(value))
	images: string[];
}
