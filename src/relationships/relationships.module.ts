import { Module } from '@nestjs/common';
import { RelationshipsService } from './relationships.service';
import { RelationshipsResolver } from './relationships.resolver';
import { RelationshipsRepository } from './relationships.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Relationship, RelationshipSchema } from './relationships.schema';

@Module({
  providers: [RelationshipsService, RelationshipsResolver, RelationshipsRepository],
  exports: [RelationshipsService, RelationshipsResolver, RelationshipsRepository],
  imports: [
    RelationshipsModule,
    MongooseModule.forFeatureAsync([
      {
        name: Relationship.name,
        useFactory: () => {
          const schema = RelationshipSchema;
          return schema;
        },
      },
    ]),
  ],
})
export class RelationshipsModule {}
