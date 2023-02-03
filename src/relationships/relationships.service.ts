import { Injectable } from '@nestjs/common';
import RelationshipInput from './dto/relationship.input';
import { RelationshipsRepository } from './relationships.repository';
import { Relationship } from './relationships.schema';

@Injectable()
export class RelationshipsService {
  /**
   *
   */
  constructor(private readonly relationshipsRepository: RelationshipsRepository) {}

  async addRelationship(relationship: Relationship): Promise<Relationship> {
    return this.relationshipsRepository.addRelationship(relationship);
  }
  async retrieveEntireRelationships(
    userId: string,
    isPending: boolean,
    isBlock: boolean,
  ): Promise<Relationship[]> {
    return this.relationshipsRepository.retrieveEntireRelationships(userId, isPending, isBlock);
  }

  async removeRelationship(relationship: Relationship): Promise<Relationship> {
    return this.relationshipsRepository.removeRelationship({
      ...relationship,
    });
  }

  async retrieveRelationship(relationship: Relationship): Promise<Relationship> {
    return this.relationshipsRepository.retrieveRelationship(relationship);
  }

  async acceptRelationship(relationship: Relationship): Promise<Relationship> {
    console.log(relationship);

    return this.relationshipsRepository.acceptRelationship(relationship);
  }

  async blockRelationship(relationship: Relationship): Promise<Relationship> {
    return this.relationshipsRepository.blockRelationship(relationship);
  }

  async unblockRelationship(relationship: Relationship): Promise<Relationship> {
    return this.relationshipsRepository.unblockRelationship(relationship);
  }
}
