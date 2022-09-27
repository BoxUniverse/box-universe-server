import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class File {
  @Field({ nullable: true })
  filename: string;

  @Field({ nullable: true })
  mimetype: string;

  @Field({ nullable: true })
  encoding: string;

  @Field({ nullable: true })
  url: string;
}
