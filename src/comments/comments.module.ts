import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesModule } from '@src/profiles';
import {
  Comment,
  CommentSchema,
  CommentsRepository,
  CommentsResolver,
  CommentsService,
} from '@src/comments';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Comment.name,
        useFactory: () => CommentSchema,
      },
    ]),
    ProfilesModule,
  ],
  providers: [CommentsService, CommentsResolver, CommentsRepository],
})
export class CommentsModule {}
