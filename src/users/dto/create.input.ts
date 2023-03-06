import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ProviderInput } from '@src/users';

@ArgsType()
@InputType()
export class CreateInput {
  @IsString()
  @Length(6, 15)
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  @Field(() => String, { nullable: true })
  password: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => ProviderInput)
  provider: ProviderInput;
}
