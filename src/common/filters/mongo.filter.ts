import { Catch, ExceptionFilter } from '@nestjs/common';
import { MongoServerError, MongoError } from 'mongodb';

@Catch(MongoError, MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch() {
    return new Error('Kec');
  }
}
