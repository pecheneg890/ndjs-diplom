import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as session from 'express-session';
import { WsAdapter } from './adapters/ws.adapter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
	if (!process.env.SESSION_SECRET) throw Error('No session secret');

	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');

	const se = session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	});
	app.use(se);
	app.use(passport.session());
	app.useWebSocketAdapter(new WsAdapter(app as NestExpressApplication, se));
	await app.listen(3000);
}


bootstrap();
