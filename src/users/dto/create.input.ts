import { ArgsType, createUnionType, Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';
import { ProviderInput } from '../users.type';

export const _ProviderInput = createUnionType({
  name: '_ProviderInput',
  types: () => [ProviderInput, String] as const,
});

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
