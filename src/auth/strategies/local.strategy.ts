import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcryptjs';
import { WRONG_PASSWORD } from '../auth.constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({ usernameField: 'email' });
    }

    async validate(username: string, password: string): Promise<any> {
        console.log('validate Local Strategy ' + username + password);
        // Выполняем проверку
        let user;
        try {
            user = await this.userService.findByEmail(username);
        } catch (e) { }
        if (!user) {
            throw new UnauthorizedException();
        }

        const isCorrectPassword = await compare(password, user.passwordHash);
        if (!isCorrectPassword) throw new UnauthorizedException();

        return user;
    }
}
