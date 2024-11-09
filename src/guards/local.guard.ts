import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

//расширяем auth guard local, добавляем вызов метода login, 
//он передает иснормацию о пользователе в сессию
@Injectable()
export class LocalGuard extends AuthGuard('local') {
	constructor(private reflector: Reflector) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		console.log('вызов LocalGuard');
		const result = (await super.canActivate(context) as boolean);
		await super.logIn(request);
		return result;
	}
}
