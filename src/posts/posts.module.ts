import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfilesModule } from '@profiles/profiles.module';
import {
  Post,
  PostSchema,
  PostsGateway,
  PostsRepository,
  PostsResolver,
  PostsService,
} from '@src/posts';

@Module({
  imports: [
    ProfilesModule,
    MongooseModule.forFeatureAsync([
      {
        name: Post.name,
        useFactory: () => {
          return PostSchema;
        },
      },
    ]),
  ],
  providers: [PostsResolver, PostsService, PostsRepository, PostsGateway],
  exports: [PostsService],
})
export class PostsModule {}
