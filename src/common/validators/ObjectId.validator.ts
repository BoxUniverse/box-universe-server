import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { isValidObjectId } from 'mongoose';

@ValidatorConstraint({ async: true })
export class IsObjectIdConstraint implements ValidatorConstraintInterface {
  validate(objectId: string) {
    return isValidObjectId(objectId);
  }

  defaultMessage(): string {
    return 'Id is not valid';
  }
}
