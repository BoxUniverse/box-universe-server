import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

export type UserProvider = {
  name: string;
  id: string;
};
export type ProvidersType = 'FACEBOOK' | 'GOOGLE' | 'GITHUB' | 'DISCORD';

@ObjectType()
export class Provider {
  @Field()
  id: string;
  @Field()
  type: string;
}

@InputType()
export class ProviderInput {
  @Field({ nullable: true })
  @IsOptional()
  id?: string;

  @IsNotEmpty()
  @Field({ nullable: false })
  type: string;
}
