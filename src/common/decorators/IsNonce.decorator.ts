import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsObjectIdConstraint } from '@validators/ObjectId.validator';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsNonce',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsObjectIdConstraint,
    });
  };
}
