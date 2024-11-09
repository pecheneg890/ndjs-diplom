import { ObjectId } from "mongoose";
import { Role } from "src/user/schemas/user.schema";

export interface IReqUser {
    id: string,
    email: string;
    role: Role
}