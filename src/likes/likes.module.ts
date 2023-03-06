import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesModule } from '@src/profiles';
import { PostsModule } from '@src/posts';
import { Like, LikeSchema, LikesRepository, LikesResolver, LikesService } from '@src/likes';

@Module({
  imports: [
    ProfilesModule,
    PostsModule,
    MongooseModule.forFeatureAsync([
      {
        name: Like.name,
        useFactory: () => {
          return LikeSchema;
        },
      },
    ]),
  ],
  providers: [LikesResolver, LikesService, LikesRepository],
})
export class LikesModule {}
