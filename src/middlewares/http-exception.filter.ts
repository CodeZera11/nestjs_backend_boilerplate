import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log(' the exception is here', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    // const status = exception.getStatus();
    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    console.log(exception);

    let message: string | string[] = 'Something went wrong';
    let details = '';
    let stackTrace = '';
    if (exception instanceof HttpException) {
      message = exception.message;
    }

    if (exception instanceof PrismaClientUnknownRequestError) {
      message =
        "The request couldn't be understood by the server due to malformed syntax";
      message = exception.message;
    }
    // invalid operation: example: want to delete an item that doesn't exist
    if (exception instanceof PrismaClientKnownRequestError) {
      message = JSON.parse(JSON.stringify(exception)).meta.cause;
      stackTrace = exception.message;
    }
    // trying to put invalid data into database
    if (exception instanceof PrismaClientValidationError) {
      message = 'Validation failed in database level';
      stackTrace = exception.message;
      status = HttpStatus.BAD_REQUEST;
    }

    if (exception instanceof BadRequestException) {
      message = 'Bad request';
      details = JSON.parse(JSON.stringify(exception)).response.message;
    }

    if (exception instanceof NotFoundException) {
      message = `Invalid API endpoint - ${request.url}`;
      details = JSON.parse(JSON.stringify(exception)).response.message;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      details: details ? details : exception.toString(),
      stackTrace,
    });
  }
}
