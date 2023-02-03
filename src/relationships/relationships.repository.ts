import { MongooseExceptionFilter } from '@filters/mongoose.filter';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import RelationshipInput from './dto/relationship.input';
import { Relationship, RelationshipDocument } from './relationships.schema';

@Injectable()
export class RelationshipsRepository {
  constructor(
    @InjectModel(Relationship.name) private readonly relationshipModel: Model<RelationshipDocument>,
  ) {}

  async addRelationship(relationship: Relationship): Promise<Relationship> {
    try {
      return this.relationshipModel.create({
        ...relationship,
      });
    } catch (error) {
      // throw new MongooseExceptionFilter();
      console.log(error);
    }
  }
  async removeRelationship(relationship: Relationship): Promise<Relationship> {
    return this.relationshipModel.findOneAndRemove({
      ...relationship,
    });
  }
  async retrieveRelationship(relationship: Relationship): Promise<Relationship> {
    return this.relationshipModel.findOne({
      ...relationship,
    });
  }
  async retrieveEntireRelationships(
    userId: string,
    isPending: boolean,
    isBlock: boolean,
  ): Promise<Relationship[]> {
    return this.relationshipModel.find({
      userId,
      isBlock,
      isPending,
    });
  }

  async retrieveRelationshipsPending(userId: string): Promise<Relationship[]> {
    return this.relationshipModel.find({
      userId,
      isPending: true,
      isBlock: false,
    });
  }

  async retrieveRelationshipsAccepted(userId: string): Promise<Relationship[]> {
    return this.relationshipModel.find({
      userId,
      isPending: false,
      isBlock: false,
    });
  }

  async acceptRelationship(relationship: Relationship): Promise<Relationship> {
    return this.relationshipModel.findOneAndUpdate(
      {
        ...relationship,
        isPending: true,
        isBlock: false,
      },
      {
        isPending: false,
      },
    );
  }

  async blockRelationship(relationship: Relationship): Promise<Relationship> {
    return this.relationshipModel.findOneAndUpdate(
      {
        ...relationship,
      },
      {
        isBlock: true,
      },
    );
  }

  async unblockRelationship(relationship: Relationship): Promise<Relationship> {
    return this.relationshipModel.findOneAndUpdate(
      {
        ...relationship,
      },
      {
        isBlock: false,
      },
    );
  }
}
