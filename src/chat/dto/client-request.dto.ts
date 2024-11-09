import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ClientRequestDto {
    @IsString()
    @IsNotEmpty()
    text: string;
}
