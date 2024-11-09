import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HotelModule } from './hotel/hotel.module';
import { ReservationModule } from './reservation/reservation.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongoConfig } from './config/mongo.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { FilesModule } from './files/files.module';
import { SessionGuard } from './guards/session.guard';
import { ChatModule } from './chat/chat.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		HotelModule,
		ReservationModule,
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getMongoConfig,
		}),
		UserModule,
		AuthModule,
		FilesModule,
		ChatModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: SessionGuard,
		},
	],
})
export class AppModule { }
