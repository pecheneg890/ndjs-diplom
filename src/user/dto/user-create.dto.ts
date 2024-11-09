import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Role } from '../schemas/user.schema';
import { SearchUserParams } from '../user.interfaces';

export class UserCreateDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@IsString()
	password: string;

	@IsString()
	@IsOptional()
	name: string;

	@IsString()
	@IsOptional()
	contactPhone: string;

	@IsNotEmpty()
	@IsEnum(Role)
	role: Role;
}

export class UserCreateResponseDto {
	id: string;
	email: string;
	name: string;
	contactPhone: string;
	role: string;
}


export class UserSearchResponse {
	id: string;
	email: string;
	name: string;
	contactPhone: string;
}

