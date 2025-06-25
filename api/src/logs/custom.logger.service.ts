import { Injectable, Scope, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends Logger {
  private logLevels: Record<string, number> = {
    error: 0,
    warn: 1,
    log: 2,
    debug: 3,
    verbose: 4,
  };

  private currentLogLevel: number;

  constructor(private configService: ConfigService) {
    super();
    const logLevel = this.configService.getOrThrow('app.logLevel', {
      infer: true,
    });
    this.currentLogLevel = this.logLevels[logLevel] || 0;
  }

  setContext(context: string): this {
    (this as any).context = context;
    return this;
  }

  error(message: any, stack?: string, context?: string): void {
    if (this.currentLogLevel >= this.logLevels.error) {
      if (!context && !stack) {
        super.error(message);
      } else if (!context) {
        super.error(message, stack);
      } else {
        super.error(message, stack, context);
      }
    }
  }

  warn(message: any, context?: string): void {
    if (this.currentLogLevel >= this.logLevels.warn) {
      if (!context) {
        super.warn(message);
      } else {
        super.warn(message, context);
      }
    }
  }

  log(message: any, context?: string): void {
    if (this.currentLogLevel >= this.logLevels.log) {
      if (!context) {
        super.log(message);
      } else {
        super.log(message, context);
      }
    }
  }

  debug(message: any, context?: string): void {
    if (this.currentLogLevel >= this.logLevels.debug) {
      if (!context) {
        super.debug(message);
      } else {
        super.debug(message, context);
      }
    }
  }

  verbose(message: any, context?: string): void {
    if (this.currentLogLevel >= this.logLevels.verbose) {
      if (!context) {
        super.verbose(message);
      } else {
        super.verbose(message, context);
      }
    }
  }
}
