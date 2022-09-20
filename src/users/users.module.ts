import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UsersRepository } from './users.repository';
import { hashSync } from 'bcrypt';
import { S3Module } from 'src/s3/s3.module';
import { random } from 'lodash';
import * as moment from 'moment';
import { ProfilesModule } from '@src/profiles/profiles.module';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', function () {
            const nowUnix = moment().format('x');

            const toUnix = moment()
              .add(`${random(0, 100)}`, 'seconds')
              .format('x');
            const password = this.password ?? random(+nowUnix, +toUnix).toString();
            // register for email first time appearance
            if (this.providers[0].type === 'credentials') {
              this.providers[0].id = this._id.toString();
            }
            this.password = hashSync(password, parseInt(process.env.SALT));
          });
          return schema;
        },
      },
    ]),
    S3Module,
    ProfilesModule,
  ],
  providers: [UsersService, UsersResolver, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
