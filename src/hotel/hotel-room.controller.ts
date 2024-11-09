import {
    Controller,
    Param,
    Get,
    Post,
    Body,
    Delete,
    Patch,
    ValidationPipe,
    UsePipes,
    NotFoundException,
    ParseIntPipe,
    Query,
    Put,
    UseInterceptors,
    UploadedFiles,
} from '@nestjs/common';
import { Roles } from '../decorators/role.decorator';
import { User } from '../decorators/user.decorator';
import { HotelRoomService } from './hotel-room.service';
import { Role } from 'src/user/schemas/user.schema';
import { HotelRoomCreateDto } from './dto/hotel-room-create.dto';
import { FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from 'src/files/files.service';
import { v4 as uuidv4 } from 'uuid';
import * as mongoose from 'mongoose';
import { HotelRoomUpdateDto } from './dto/hotel-room-update.dto';
import { IReqUser } from 'src/common/common.interfaces';

@Controller('common/hotel-rooms')
export class HotelRoomController {
    constructor(private readonly hotelRoomService: HotelRoomService,
        private readonly filesService: FilesService
    ) { }

    @Get()
    async findHotelRoom(
        @Query('limit', ParseIntPipe) limit: number,
        @Query('offset', ParseIntPipe) offset: number,
        @Query('hotel') hotel: string,
        @User() user: IReqUser) {

        const result = await this.hotelRoomService.search({
            limit: limit,
            offset: offset,
            hotel: hotel,
            ... (!user || user.role === Role.client) ? { isEnabled: true } : {}
        });

        return result.map((el) => ({
            id: el._id,
            description: el.description,
            images: el.images,
            hotel: {
                id: el.hotel._id,
                title: el.hotel.title
            }
        }));
    }


    @Get(':id')
    async get(@Param('id') id: string) {
        const hotelRoom = await this.hotelRoomService.findById(id);
        return {
            id: hotelRoom._id,
            description: hotelRoom.description,
            images: hotelRoom.images,
            hotel: {
                id: hotelRoom.hotel._id,
                title: hotelRoom.hotel.title,
                description: hotelRoom.hotel.description
            }
        }
    }


    @Post()
    @Roles([Role.admin])
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FilesInterceptor('images'))
    async create(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() dto: HotelRoomCreateDto) {

        const _id = new mongoose.Types.ObjectId();
        const urls = await this.filesService.saveFiles(files, _id.toString());
        const hotelRoom = await this.hotelRoomService.create({
            _id: _id.toString(),
            hotel: dto.hotelId,
            description: dto.description,
            images: urls
        });

        return {
            id: hotelRoom._id,
            description: hotelRoom.description,
            images: hotelRoom.images,
            isEnabled: hotelRoom.isEnabled,
            hotel: {
                id: hotelRoom.hotel._id,
                title: hotelRoom.hotel.title,
                description: hotelRoom.hotel.description
            }
        }
    }

    @Put(':id')
    @Roles([Role.admin])
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseInterceptors(FilesInterceptor('images'))
    async update(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() dto: HotelRoomUpdateDto,
        @Param('id') id: string) {

        const urls = await this.filesService.saveFiles(files, id);
        urls.push(...dto.images);

        const hotelRoom = await this.hotelRoomService.update(id, {
            hotel: dto.hotelId,
            description: dto.description,
            isEnabled: dto.isEnabled,
            images: urls
        });

        return {
            id: hotelRoom._id,
            description: hotelRoom.description,
            images: hotelRoom.images,
            isEnabled: hotelRoom.isEnabled,
            hotel: {
                id: hotelRoom.hotel._id,
                title: hotelRoom.hotel.title,
                description: hotelRoom.hotel.description
            }
        }
    }

}
