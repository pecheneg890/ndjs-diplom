import { ID } from "src/common/common.types";
import { User, UserDocument } from "./schemas/user.schema";

export interface IUserService {
  create(data: Partial<User>): Promise<UserDocument>;
  findById(id: ID): Promise<UserDocument>;
  findByEmail(email: string): Promise<UserDocument>;
  findAll(params: SearchUserParams): Promise<UserDocument[]>;
}


export interface SearchUserParams {
  limit: number;
  offset: number;
  email: string;
  name: string;
  contactPhone: string;
}