import { Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError, MongoServerError } from 'mongodb';

@Catch(MongoError, MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch() {
    return new Error('Kec');
  }
}
