import { IsObjectIdConstraint } from '@validators/ObjectId.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';


export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsObjectIdConstraint,
    });
  };
}
