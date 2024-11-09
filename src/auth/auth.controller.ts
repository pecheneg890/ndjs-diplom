import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCreateDto } from '../user/dto/user-create.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { LocalGuard } from 'src/guards/local.guard';
import { IReqUser } from 'src/common/common.interfaces';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('register')
	async register(@Body() dto: UserCreateDto) {
		await this.authService.register(dto);
	}

	@Post('login')
	@UseGuards(LocalGuard)
	async login(@Body() user: IReqUser) {
		return await this.authService.login(user.email);
	}
}
