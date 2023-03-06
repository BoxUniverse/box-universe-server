import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@ArgsType()
@InputType()
export class LoginInput {
  @IsString()
  @Length(6, 15)
  @IsNotEmpty()
  @Field(() => String)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  @Field(() => String)
  password: string;

  @IsNotEmpty()
  @Field(() => String)
  nonce: string;
}
