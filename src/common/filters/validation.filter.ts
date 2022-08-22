import { BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { Error } from 'mongoose';

const ValidationError = Error.ValidationError;
/*
 TODO: return field array for client
 WARNING: graphql not receive this error
 INFO: map list error from mongodb to graphql
*/

@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: Error.ValidationError) {
    const listErrors = Object.keys(exception.errors).map((key: string) => {
      return {
        field: key,
        message: exception.errors[key].message,
        code: 26042,
      };
    });
    console.log(listErrors);

    return new BadRequestException(listErrors, 'ValidationError');
  }
}
