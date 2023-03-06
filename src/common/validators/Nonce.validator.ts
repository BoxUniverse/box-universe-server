import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsNonceConstraint implements ValidatorConstraintInterface {
  validate(nonce: string) {
    return true;
  }

  defaultMessage(): string {
    return 'Id is not valid';
  }
}
