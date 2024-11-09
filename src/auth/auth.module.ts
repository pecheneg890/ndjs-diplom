import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { UserSerializer } from './user.serializer';

@Module({
	imports: [
		UserModule,
		ConfigModule,
		PassportModule.register({ session: true }),
	],
	controllers: [AuthController],
	providers: [AuthService, UserSerializer, LocalStrategy],
	exports: [AuthService]
})
export class AuthModule { }
