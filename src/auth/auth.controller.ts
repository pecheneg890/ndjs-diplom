import { BadRequestException, Body, Controller, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDto } from '../user/dto/user-create.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { LocalGuard } from 'src/guards/local.guard';
import { IReqUser } from 'src/common/common.interfaces';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/user/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('register')
	@UsePipes(new ValidationPipe())
	async register(@Body() dto: RegisterDto) {
		const user = await this.authService.register(dto);

		return {
			id: user._id,
			email: user.email,
			name: user.name,
		}
	}

	@Post('login')
	@UseGuards(LocalGuard)
	async login(@Body() user: LoginDto) {
		return await this.authService.login(user.email);
	}

	@Post('logout')
	@Roles([Role.admin, Role.client, Role.manager])
	async logout(@Req() request: Request) {
		this.authService.logout(request);
	}
}
