import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserCreateDto } from '../user/dto/user-create.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { USER_NOT_FOUND, WRONG_PASSWORD } from './auth.constants';
import { compare } from 'bcryptjs';
import { Request } from 'express';
import { RegisterDto } from './dto/register.dto';
import { Role } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
	) { }

	async register(dto: RegisterDto) {
		return this.userService.create({ ...dto, role: Role.client });
	}

	async login(email: string) {
		try {
			const user = await this.userService.findByEmail(email);

			return {
				email: user.email,
				name: user.name,
				contactPhone: user.contactPhone
			};
		} catch (err) {
			throw new UnauthorizedException('Login error', err.message);
		}
	}

	async logout(request: Request) {
		return new Promise<void>((resolve, reject) => {
			request.logOut((err) => {
				if (err) { throw new BadRequestException('Logout error', err.toString()); }
				else resolve();
			});
		});
	}
}
