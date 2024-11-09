import { ID } from "src/common/common.types";
import { Hotel, HotelDocument } from "./schemas/hotel.schema";
import { HotelRoom, HotelRoomDocument } from "./schemas/hotel-room.schema";

export interface SearchHotelParams {
    limit: number;
    offset: number;
    title: string;
}

export interface UpdateHotelParams {
    title: string;
    description: string;
}

export interface IHotelService {
    create(data: any): Promise<HotelDocument>;
    findById(id: ID): Promise<HotelDocument>;
    search(params: SearchHotelParams): Promise<HotelDocument[]>;
    update(id: ID, data: UpdateHotelParams): Promise<HotelDocument>;
}

export interface SearchRoomsParams {
    limit: number;
    offset: number;
    hotel: ID;
    isEnabled?: boolean;
}

export interface HotelRoomCreation {
    _id: ID;
    hotel: ID;
    description: string;
    images: string[];
}

export interface HotelRoomUpdate {
    hotel: ID;
    description: string;
    images: string[];
    isEnabled: boolean;
}

export interface IHotelRoomService {
    create(data: HotelRoomCreation): Promise<HotelRoomDocument>;
    findById(id: ID): Promise<HotelRoomDocument>;
    search(params: SearchRoomsParams): Promise<HotelRoomDocument[]>;
    update(id: ID, data: HotelRoomUpdate): Promise<HotelRoomDocument>;
}

export interface SearchRoomsParamsModel {
    hotel: ID;
    isEnabled?: boolean;
}
