import {
	Controller,
	Param,
	Get,
	Post,
	Body,
	ValidationPipe,
	UsePipes,
	ParseIntPipe,
	Query,
	Put,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelUpdateDto } from './dto/hotel-update.dto';
import { Roles } from '../decorators/role.decorator';
import { Role } from '../user/schemas/user.schema';
import { HotelCreateDto } from './dto/hotel-create.dto';

@Controller('/admin/hotels')
export class HotelController {
	constructor(private readonly hotelService: HotelService) { }

	@Post()
	@Roles([Role.admin])
	@UsePipes(new ValidationPipe())
	async createHotel(@Body() dto: HotelCreateDto) {
		const hotel = await this.hotelService.create(dto);
		return {
			id: hotel._id,
			title: hotel.title,
			description: hotel.description
		}
	}

	@Get()
	@Roles([Role.admin])
	async findHotels(
		@Query('limit', ParseIntPipe) limit: number,
		@Query('offset', ParseIntPipe) offset: number,
		@Query('title') title: string) {
		const result = await this.hotelService.search({
			limit: limit,
			offset: offset,
			title: title
		});

		return result.map((el) => ({
			id: el._id,
			title: el.title,
			description: el.description
		}));
	}

	@Put(':id')
	@Roles([Role.admin])
	@UsePipes(new ValidationPipe())
	async update(@Param('id') id: string, @Body() dto: HotelUpdateDto) {
		const hotel = await this.hotelService.update(id, dto);
		return {
			id: hotel._id,
			title: hotel.title,
			description: hotel.description
		}
	}

}
