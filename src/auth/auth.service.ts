import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserCreateDto } from '../user/dto/user-create.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { USER_NOT_FOUND, WRONG_PASSWORD } from './auth.constants';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
	) { }

	async register(dto: UserCreateDto) {
		return this.userService.create(dto);
	}

	async login(email: string) {
		const user = await this.userService.findByEmail(email);
		if (!user) throw new UnauthorizedException(USER_NOT_FOUND);

		return {
			email: user.email,
			name: user.name,
			contactPhone: user.contactPhone
		};
	}
}
