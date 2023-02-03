import { CacheModule, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './authentication/auth.module';
import { S3Service } from './s3/s3.service';
import { S3Module } from './s3/s3.module';
import { UsersService } from '@users/users.service';
import { ProfilesModule } from './profiles/profiles.module';
import { BullModule } from '@nestjs/bull';
import { RelationshipsModule } from './relationships/relationships.module';
import { EventsModule } from './events/events.module';
import * as redisStore from 'cache-manager-redis-store';
import { AppGateway } from './app.gateway';
import { RequestsModule } from './requests/requests.module';
import { FriendsModule } from './friends/friends.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ConversationsModule } from './conversations/conversations.module';

@Module({
  imports: [
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
          path: '/subscription',
        },
      },
      cors: {
        origin: '*',
        credentials: true,
      },
      debug: process.env.NODE_ENV !== 'production',
      path: '/',
      context: ({ req, res }) => ({ req, res }),
    }),
    UsersModule,
    AuthModule,
    S3Module,
    ProfilesModule,
    // RelationshipsModule,
    EventsModule,
    RequestsModule,
    FriendsModule,
    NotificationsModule,
    ConversationsModule,
  ],
  providers: [S3Service, UsersService, AppGateway],
})
export class AppModule {}
