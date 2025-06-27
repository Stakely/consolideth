import { Global, Module } from '@nestjs/common';
import { LogsService } from './logs.service';
import { CustomLogger } from './custom.logger.service';

@Global()
@Module({
  providers: [LogsService, CustomLogger],
  exports: [LogsService, CustomLogger],
})
export class LogsModule {}
