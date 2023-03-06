import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';
import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '@src/authentication';
import { CommentsModule } from '@src/comments';
import { ConversationsModule } from '@src/conversations';
import { FriendsModule } from '@src/friends';
import { LikesModule } from '@src/likes';
import { MessagesModule } from '@src/messages';
import { NotificationsModule } from '@src/notifications';
import { PostsModule } from '@src/posts';
import { ProfilesModule } from '@src/profiles';
import { PubSubModule } from '@src/pubsub.module';
import { RequestsModule } from '@src/requests';
import { S3Module } from '@src/s3';
import { UsersModule } from '@src/users';
import * as redisStore from 'cache-manager-redis-store';
import { PubSub } from 'graphql-subscriptions';
import { join } from 'path';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    CacheModule.register({ isGlobal: true, store: redisStore, host: 'redis', port: 6379 }),
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      playground: true,
      csrfPrevention: false,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
        },
        'subscriptions-transport-ws': {
          path: '/graphql',
          onConnect: (headers) => {
            return { req: { headers: headers } };
          },
        },
      },

      cors: {
        origin: '*',
        credentials: true,
      },
      debug: process.env.NODE_ENV === 'development',
      context: ({ req, res, connection }) => ({ req, res, connection }),
    }),
    PubSubModule,
    S3Module,
    UsersModule,
    FriendsModule,
    ProfilesModule,
    AuthModule,
    RequestsModule,
    NotificationsModule,
    ConversationsModule,
    MessagesModule,
    PostsModule,
    CommentsModule,
    LikesModule,
  ],
})
export class AppModule {}
