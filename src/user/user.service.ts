import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Role, User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserCreateDto } from './dto/user-create.dto';
import { USER_ALREADY_EXIST, USER_NOT_FOUND } from './user.constants';
import { hash, genSalt } from 'bcryptjs';
import { IUserService, SearchUserParams } from './user.interfaces';
import { ID } from 'src/common/common.types';

@Injectable()
export class UserService implements IUserService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {

		//создание первого пользователя в БД
		this.createFirstUser();
	}

	async findById(id: ID): Promise<UserDocument> {
		const user = await this.userModel.findById(id).exec();
		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND);
		}
		return user;
	}

	async findByEmail(email: string): Promise<UserDocument> {
		const user = await this.userModel.findOne({ email }).exec();
		if (!user) {
			throw new NotFoundException(USER_NOT_FOUND);
		}
		return user;
	}

	async findAll(params: SearchUserParams): Promise<UserDocument[]> {
		return this.userModel.find({
			email: { $regex: params.email },
			name: { $regex: params.name },
			contactPhone: { $regex: params.contactPhone }
		}).sort('_id').skip(params.offset).limit(params.limit).exec();
	}

	async create(dto: UserCreateDto): Promise<UserDocument> {
		let oldUser;
		try {
			oldUser = await this.findByEmail(dto.email);
		} catch (e) { }
		if (oldUser) {
			throw new BadRequestException(USER_ALREADY_EXIST);
		}

		const salt = await genSalt(10);
		const newUser: User = {
			email: dto.email,
			name: dto.name,
			contactPhone: dto.contactPhone,
			role: dto.role,
			passwordHash: await hash(dto.password, salt)
		};
		return this.userModel.create(newUser);
	}

	async createFirstUser() {
		const userCount = await this.userModel.countDocuments();
		if (userCount) return;

		await this.create({
			name: 'admin',
			email: 'aaa@mail.ru',
			password: '123',
			contactPhone: '12345',
			role: Role.admin
		});
		console.log('first user aaa@mail.ru was created');
	}

}
