import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';

@Module({
	imports: [
		ThrottlerModule.forRoot({
			skipIf(context) {
				const request = context.switchToHttp().getRequest();
				return request.ip === '::1';
			},
		}),
	],
	controllers: [AppController],
	providers: [
		PrismaService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
		AppService,
	],
})
export class AppModule {}
