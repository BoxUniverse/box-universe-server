import { Authorization } from '@decorators/Authorization.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Current } from '@users/types/UserOAuth';
import RelationshipInput from '@relationships/dto/relationship.input';
import { Relationship } from '@relationships/relationships.schema';
import { RelationshipsService } from '@relationships/relationships.service';

@Resolver()
@UseGuards(AuthGuard)
export class RelationshipsResolver {
  constructor(private readonly relationshipsService: RelationshipsService) {}
  @Mutation(() => Relationship, {
    nullable: false,
    name: 'addRelationship',
  })
  async addRelationship(
    @Args({ name: 'relationship', type: () => RelationshipInput.Create })
    relationship: RelationshipInput.Create,
    @Authorization()
    user: Current,
  ): Promise<Relationship> {
    const mapRelationshipInput = {
      ...relationship,
      userId: user.sub,
    };
    console.log(mapRelationshipInput);

    return this.relationshipsService.addRelationship(mapRelationshipInput);
  }

  @Query(() => [Relationship], {
    name: 'retrieveRelationships',
    nullable: true,
  })
  async retrieveRelationships(
    @Args({ name: 'relationship', type: () => RelationshipInput.Info })
    relationship: RelationshipInput.Info,
    @Authorization()
    user: Current,
  ): Promise<Relationship> {
    const mapRelationshipInput = {
      userId: relationship.friendId,
      friendId: user.sub,
    };
    return this.relationshipsService.retrieveRelationship(mapRelationshipInput);
  }

  @Query(() => [Relationship], {
    name: 'retrieveEntireRelationships',
    nullable: true,
  })
  async retrieveEntireRelationships(
    @Authorization()
    user: Current,

    @Args({ name: 'status', type: () => RelationshipInput.Status })
    status: RelationshipInput.Status,
  ): Promise<Relationship[]> {
    const { isBlock, isPending } = status;
    return this.relationshipsService.retrieveEntireRelationships(user.sub, isPending, isBlock);
  }

  @Mutation(() => Relationship, {
    name: 'acceptRelationship',
    nullable: true,
  })
  async acceptRelationship(
    @Args({ name: 'relationship', type: () => RelationshipInput.Info })
    relationship: RelationshipInput.Info,

    @Authorization()
    user: Current,
  ): Promise<Relationship> {
    const mapRelationshipInput = {
      ...relationship,
      userId: user.sub,
    };
    return this.relationshipsService.acceptRelationship(mapRelationshipInput);
  }

  @Mutation(() => Relationship, {
    name: 'blockRelationship',
    nullable: true,
  })
  async blockRelationship(
    @Args({ name: 'relationship', type: () => RelationshipInput.Info })
    relationship: RelationshipInput.Info,

    @Authorization()
    user: Current,
  ): Promise<Relationship> {
    const mapRelationshipInput = {
      ...relationship,
      userId: user.sub,
    };
    return this.relationshipsService.blockRelationship(mapRelationshipInput);
  }

  @Mutation(() => Relationship, {
    name: 'unblockRelationship',
    nullable: true,
  })
  async unblockRelationship(
    @Args({ name: 'relationship', type: () => RelationshipInput.Info })
    relationship: RelationshipInput.Info,

    @Authorization()
    user: Current,
  ): Promise<Relationship> {
    const mapRelationshipInput = {
      ...relationship,
      userId: user.sub,
    };
    return this.relationshipsService.blockRelationship(mapRelationshipInput);
  }
}
