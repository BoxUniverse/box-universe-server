import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';

@ArgsType()
@InputType()
export class OAuthInput {
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  id: string;

  @IsString()
  @Length(6, 15)
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String, { nullable: true })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  provider: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String, { nullable: true })
  nonce: string;
}
