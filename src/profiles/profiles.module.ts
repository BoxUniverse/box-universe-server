import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationsModule } from '@src/conversations/conversations.module';
import { S3Module } from '@src/s3';
import { UsersModule } from '@src/users';
import * as moment from 'moment';

import {
  Profile,
  ProfileSchema,
  ProfilesGateway,
  ProfilesProcessor,
  ProfilesRepository,
  ProfilesResolver,
  ProfilesService,
} from '@src/profiles';

@Module({
  providers: [
    ProfilesResolver,
    ProfilesService,
    ProfilesRepository,
    ProfilesProcessor,
    ProfilesGateway,
  ],
  imports: [
    forwardRef(() => UsersModule),
    S3Module,
    forwardRef(() => ConversationsModule),
    BullModule.registerQueue({
      name: 'profile-queue',
    }),
    MongooseModule.forFeatureAsync([
      {
        name: Profile.name,
        useFactory: () => {
          const schema = ProfileSchema;
          schema.pre('save', function () {
            if (this.provider === 'credentials') {
              const [username] = this.email.split('@');
              const nowUnix = moment().format('x');
              this.name = `${username}${nowUnix}`;
            }
          });

          return schema;
        },
      },
    ]),
  ],
  exports: [ProfilesService, ProfilesRepository, ProfilesResolver],
})
export class ProfilesModule {}
