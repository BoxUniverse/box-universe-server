import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { ProfilesResolver } from './profiles.resolver';
import { ProfilesService } from './profiles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './profiles.schema';
import { ProfilesRepository } from './profiles.repository';
import * as moment from 'moment';
import { UsersModule } from '@users/users.module';
import { S3Module } from '@s3/s3.module';
import { BullModule } from '@nestjs/bull';
import { ProfilesProcessor } from './profiles.processor';
import { ProfilesGateway } from './profiles.gateway';
import { RelationshipsModule } from '@src/relationships/relationships.module';

@Module({
  providers: [
    ProfilesResolver,
    ProfilesService,
    ProfilesRepository,
    ProfilesProcessor,
    ProfilesGateway,
  ],
  imports: [
    RelationshipsModule,
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
              const uniqUsername = `${username}${nowUnix}`;
              this.name = uniqUsername;
            }
          });

          return schema;
        },
      },
    ]),
    forwardRef(() => UsersModule),
    S3Module,
  ],
  exports: [ProfilesService, ProfilesRepository, ProfilesResolver],
})
export class ProfilesModule {}
