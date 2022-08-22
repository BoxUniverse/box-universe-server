import { HttpException, HttpStatus } from '@nestjs/common';

export class GraphQLException extends HttpException {
  /**
   *
   */

  constructor(message: string, statusCode: HttpStatus) {
    super(message, statusCode);
  }
}
