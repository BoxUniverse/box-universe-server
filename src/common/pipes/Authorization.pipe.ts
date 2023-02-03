import { PipeTransform, Injectable } from '@nestjs/common';
import { Current } from '@users/types/UserOAuth';

@Injectable()
export class AuthorizationPipe<T, K extends Current> implements PipeTransform<T, void> {
  transform(value: T): void {
    console.log('kec', value);
    // return value;
    // const;
    // const validObjectId = ObjectId.isValid(value);
    // if (!validObjectId) throw new BadRequestException('Invalid ObjectId');
    // return new ObjectId(value);
  }
}
