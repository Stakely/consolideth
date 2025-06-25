import { Module } from '@nestjs/common';

import appConfig from './config/app.config';
import ethConfig from './eth/config/eth.config';
import { ConfigModule } from '@nestjs/config';

import { UtilsService } from './utils/utils.service';
import {
  // SentryGlobalFilter,
  SentryModule,
} from '@sentry/nestjs/setup';

import { TerminusModule } from '@nestjs/terminus';
// import { APP_GUARD } from '@nestjs/core';
// import { RolesGuard } from './roles/roles.guard';
// import { APP_FILTER } from '@nestjs/core';
import { LogsModule } from './logs/logs.module';
import { CustomLogger } from './logs/custom.logger.service';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthController } from './health/health.controller';
import { EthModule } from './eth/eth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, ethConfig],
      envFilePath: ['.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds in milliseconds
        limit: 10, // limit the number of requests per ttl
      },
    ]),
    LogsModule,
    TerminusModule,
    // HomeModule,
    SentryModule.forRoot(),
    ScheduleModule.forRoot(),
    EthModule,
  ],
  providers: [
    UtilsService,
    CustomLogger,
    // {
    //   provide: APP_FILTER,
    //   useClass: SentryGlobalFilter,
    // },
  ],
  controllers: [HealthController],
})
export class AppModule {}
