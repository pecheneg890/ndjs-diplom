import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class MarkReadDto {
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    createdBefore: Date;
}
