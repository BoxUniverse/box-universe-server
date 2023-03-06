import { IsObjectIdConstraint } from '@validators/ObjectId.validator';
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNonce(validationOptions?: ValidationOptions) {
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
