import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteResult {
  @Field()
  acknowledged: boolean;

  @Field()
  deletedCount: number;
}
