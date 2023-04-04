import { IsObjectId } from '@decorators/IsObjectId.decorator';
import { ArgsType, Field, InputType, ObjectType, OmitType, PartialType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ObjectId } from 'mongodb';
import { User, Provider } from '@src/users';

export namespace UserInput {
  @InputType()
  export class ProviderInput {
    @Field({ nullable: true })
    @IsOptional()
    id?: string;

    @IsNotEmpty()
    @Field({ nullable: false })
    type: string;
  }
  @ObjectType()
  export class UserDto {
    @IsOptional()
    @IsString()
    @IsObjectId()
    @Field(() => String)
    _id?: string;

    @IsString()
    @Length(6, 15)
    @IsNotEmpty()
    @Field()
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(6)
    @Field()
    password: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @Field()
    email: string;

    @Field(() => [Provider])
    providers: Provider[];
  }

  @ArgsType()
  @InputType()
  export class CreateUser extends OmitType(UserDto, ['providers', '_id'] as const, InputType) {
    @Field(() => ProviderInput, { nullable: true })
    provider?: ProviderInput;
  }

  @ArgsType()
  @InputType()
  export class DeleteUser extends PartialType(
    OmitType(UserDto, ['providers', 'password'] as const, InputType),
  ) {}

  @ArgsType()
  @InputType()
  export class GetUser extends PartialType(
    OmitType(UserDto, ['providers', 'password'] as const, InputType),
  ) {
    @Field(() => ProviderInput, { nullable: true })
    provider?: ProviderInput;
  }

  @ArgsType()
  @InputType()
  export class UserInput {
    @IsOptional()
    @IsString()
    @IsObjectId()
    @Field(() => String, { nullable: true })
    _id?: string | ObjectId | User;

    @IsOptional()
    @IsString()
    @Length(6, 15)
    @Field(() => String, { nullable: true })
    username?: string;

    @IsOptional()
    @IsString()
    @Field(() => String, { nullable: true })
    @Length(6)
    password?: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    @Field(() => String, { nullable: true })
    email?: string;
  }
}
