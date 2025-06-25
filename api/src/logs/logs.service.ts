import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LogsService {
  private readonly logLevel: string;
  private readonly debugLogLevelValid = ['debug'];
  private readonly infoLogLevelValid = ['debug', 'info'];
  private readonly errorLogLevelValid = ['debug', 'info', 'error'];
  constructor(private readonly configService: ConfigService) {
    this.logLevel = this.configService.getOrThrow('app.logLevel', {
      infer: true,
    });
    if (!this.logLevel) this.logLevel = 'debug';
  }

  debug(generatedFrom: string, message: string, reqId?: string) {
    if (this.debugLogLevelValid.includes(this.logLevel)) {
      const now = new Date(Date.now())
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '');
      let string =
        `| reqId: ${reqId} | generatedFrom: ${generatedFrom} | ` + message;
      if (reqId === undefined) {
        string = `| generatedFrom: ${generatedFrom} | ` + message;
      }
      console.log('\x1b[36m%s\x1b[0m', `DEBUG ${now}`, string);
    }
  }

  info(generatedFrom: string, message: string, reqId?: string) {
    if (this.infoLogLevelValid.includes(this.logLevel)) {
      const now = new Date(Date.now())
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '');
      let string =
        `| reqId: ${reqId} | generatedFrom: ${generatedFrom} | ` + message;
      if (reqId === undefined) {
        string = `| generatedFrom: ${generatedFrom} | ` + message;
      }
      console.log('\x1b[32m%s\x1b[0m', `INFO  ${now}`, string);
      // send an event
    }
  }

  error(generatedFrom: string, message: string, reqId?: string) {
    if (this.errorLogLevelValid.includes(this.logLevel)) {
      const now = new Date(Date.now())
        .toISOString()
        .replace('T', ' ')
        .replace('Z', '');
      let string =
        `| reqId: ${reqId} | generatedFrom: ${generatedFrom} | ` + message;
      if (reqId === undefined) {
        string = `| generatedFrom: ${generatedFrom} | ` + message;
      }
      console.log('\x1b[31m%s\x1b[0m', `ERROR ${now}`, string);
    }
  }
}
