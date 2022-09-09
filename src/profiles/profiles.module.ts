import { Module } from '@nestjs/common';
import { ProfilesResolver } from './profiles.resolver';
import { ProfilesService } from './profiles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './profiles.schema';
import { ProfilesRepository } from './profiles.repository';
import * as moment from 'moment';

@Module({
  providers: [ProfilesResolver, ProfilesService, ProfilesRepository],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Profile.name,
        useFactory: () => {
          const schema = ProfileSchema;
          schema.pre('save', function () {
            const [username] = this.email.split('@');
            const nowUnix = moment().format('x');
            const uniqUsername = `${username}${nowUnix}`;
            this.name = uniqUsername;
          });

          return schema;
        },
      },
    ]),
  ],
  exports: [ProfilesService, ProfilesRepository, ProfilesResolver],
})
export class ProfilesModule {}
