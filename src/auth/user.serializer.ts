import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserDocument } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { IReqUser } from 'src/common/common.interfaces';

//сериализация/десереализация пользователя в сессию
@Injectable()
export class UserSerializer extends PassportSerializer {
    constructor(private readonly userService: UserService) {
        super();
    }

    serializeUser(user: UserDocument, done: (err, user) => void): void {
        console.log('serialize user' + user);
        done(null, user.email);
    }

    async deserializeUser(payload: string,
        done: (err, payload: IReqUser) => void
    ) {
        console.log('deserialize user' + payload);

        const user = await this.userService.findByEmail(payload);
        done(null, { id: user._id.toString(), email: user.email, role: user.role });
    }
}