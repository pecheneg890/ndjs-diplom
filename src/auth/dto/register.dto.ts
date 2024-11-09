import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';


export class RegisterDto {
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
}
