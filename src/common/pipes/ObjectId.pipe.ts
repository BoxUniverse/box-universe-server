import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ObjectIdPipe implements PipeTransform<string, ObjectId> {
  transform(value: string): ObjectId {
    const validObjectId = ObjectId.isValid(value);
    if (!validObjectId) throw new BadRequestException('Invalid ObjectId');
    return new ObjectId(value);
  }
}
