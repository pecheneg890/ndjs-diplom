import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class HotelCreateDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
