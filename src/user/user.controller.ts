import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	ParseIntPipe,
	Post,
	Query,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { UserCreateDto, UserCreateResponseDto, UserSearchResponse } from './dto/user-create.dto';
import { UserService } from './user.service';
import { Roles } from '../decorators/role.decorator';
import { Role } from './schemas/user.schema';

@Controller('')
export class UserController {
	constructor(private readonly userService: UserService) { }

	@Post('/admin/users')
	@UsePipes(new ValidationPipe())
	@Roles([Role.admin])
	async createUser(@Body() dto: UserCreateDto): Promise<UserCreateResponseDto> {
		const user = await this.userService.create(dto);

		return {
			id: user._id.toString(),
			email: user.email,
			name: user.name,
			contactPhone: user.contactPhone,
			role: user.role
		}
	}

	@Get('/admin/users')
	@Roles([Role.admin])
	async findAdminAll(
		@Query('name') name: string,
		@Query('email') email: string,
		@Query('contactPhone') contactPhone: string,
		@Query('limit', ParseIntPipe) limit: number,
		@Query('offset', new ParseIntPipe({ optional: true })) offset?: number
	): Promise<UserSearchResponse[]> {
		return this.findAll(name, email, contactPhone, limit, offset);
	}

	@Get('/manager/users')
	async findManagerAll(
		@Query('name') name: string,
		@Query('email') email: string,
		@Query('contactPhone') contactPhone: string,
		@Query('limit', ParseIntPipe) limit: number,
		@Query('offset', new ParseIntPipe({ optional: true })) offset?: number
	): Promise<UserSearchResponse[]> {
		return this.findAll(name, email, contactPhone, limit, offset);
	}

	private async findAll(
		name: string,
		email: string,
		contactPhone: string,
		limit: number,
		offset?: number
	): Promise<UserSearchResponse[]> {
		const users = await this.userService.findAll({
			limit,
			offset: offset ? offset : 0,
			name: name ? name : '',
			email: email ? email : '',
			contactPhone: contactPhone ? contactPhone : ''
		});
		return users.map((el) => {
			return {
				id: el._id.toString(),
				email: el.email,
				name: el.name,
				contactPhone: el.contactPhone
			}
		});
	}
}
