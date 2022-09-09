import { Catch, ConflictException, ExceptionFilter } from '@nestjs/common';

import { startCase } from 'lodash';
@Catch()
export class MongooseExceptionFilter implements ExceptionFilter {
  catch(exception: any) {
    switch (exception.code) {
      case 11000:
        const key = startCase(Object.keys(exception.keyValue)[0]);
        return new ConflictException(`${key} already exist`);
      default:
        return new ConflictException(exception?.response?.message);
    }
  }
}
