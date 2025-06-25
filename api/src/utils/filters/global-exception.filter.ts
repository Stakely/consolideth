import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  // Request,
  Response,
} from 'express';

import * as Sentry from '@sentry/nestjs';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let data = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'An error occurred';
      data =
        typeof exceptionResponse === 'object'
          ? (exceptionResponse as any).data || {}
          : {};
    } else if (exception instanceof Error) {
      message = exception.message;
    }
    const returnPaylod = {
      success: false,
      result: {
        message,
        data,
      },
    };
    Sentry.captureException(exception);

    // Enhanced logging
    this.logger.error(
      `Exception: ${message}\n` +
        `Stack: ${exception instanceof Error ? exception.stack : 'No stack trace'}\n` +
        `Method: ${request.method}\n` +
        `URL: ${request.url}\n` +
        `Body: ${JSON.stringify(request.body)}\n` +
        `Headers: ${JSON.stringify(request.headers)}\n` +
        `Returned: ${JSON.stringify(returnPaylod)}\n`,
      // 'GlobalExceptionFilter',
    );
    response.status(status).json(returnPaylod);
  }
}
