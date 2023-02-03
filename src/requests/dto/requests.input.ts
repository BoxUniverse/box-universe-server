import { ArgsType, Field, ID, InputType, IntersectionType } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

namespace RequestInput {
  @InputType()
  @ArgsType()
  export class CreateRequest {
    // NOTE: Optional: can be inject user from token
    @Field(() => ID, { nullable: true })
    @IsString()
    @IsOptional()
    userRequest?: string;

    @Field(() => ID)
    @IsString()
    @IsNotEmpty()
    userReceive: string;
  }

  @InputType()
  @ArgsType()
  export class InfoRequest {
    @Field(() => ID, { nullable: true })
    @IsString()
    @IsOptional()
    userRequest?: string;

    @Field(() => ID, { nullable: true })
    @IsString()
    @IsOptional()
    userReceive?: string;
  }

  @InputType()
  @ArgsType()
  export class Status {
    @Field(() => Boolean)
    @IsBoolean()
    isPending: boolean;

    @Field(() => Boolean)
    @IsBoolean()
    isReject: boolean;

    @Field(() => Boolean)
    @IsBoolean()
    isAccept: boolean;
  }

  @InputType()
  @ArgsType()
  export class RetrieveRequest extends IntersectionType(InfoRequest, Status) {}
}

export default RequestInput;
