import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiErrorItemDto } from '../api/api-response.dto';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      success: false,
      message: this.resolveMessage(exception),
      errors: this.resolveErrors(exception),
    });
  }

  private resolveMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      if (typeof payload === 'object' && payload !== null && 'message' in payload) {
        const message = (payload as { message: unknown }).message;
        return Array.isArray(message) ? message.join('; ') : String(message);
      }
      return exception.message;
    }

    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Unexpected server error';
  }

  private resolveErrors(exception: unknown): ApiErrorItemDto[] {
    if (exception instanceof HttpException) {
      const payload = exception.getResponse();
      if (typeof payload === 'object' && payload !== null && 'message' in payload) {
        const message = (payload as { message: unknown }).message;
        const messages = Array.isArray(message) ? message : [message];
        return messages.map((item) => ({
          field: 'request',
          code: this.codeFromStatus(exception.getStatus()),
          detail: String(item),
        }));
      }
    }

    return [
      {
        field: 'server',
        code: 'INTERNAL_SERVER_ERROR',
        detail: exception instanceof Error ? exception.message : 'Unexpected server error',
      },
    ];
  }

  private codeFromStatus(status: number): string {
    if (status === HttpStatus.NOT_FOUND) return 'NOT_FOUND';
    if (status === HttpStatus.BAD_REQUEST) return 'BAD_REQUEST';
    if (status === HttpStatus.TOO_MANY_REQUESTS) return 'RATE_LIMIT_EXCEEDED';
    return 'HTTP_ERROR';
  }
}
