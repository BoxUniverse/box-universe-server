import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProfilesModule } from '@src/profiles';
import { S3Module } from '@src/s3';
import { hashSync } from 'bcrypt';
import { random } from 'lodash';
import * as moment from 'moment';
import { User, UserSchema, UsersRepository, UsersResolver, UsersService } from './';

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
    forwardRef(() => ProfilesModule),
  ],
  providers: [UsersService, UsersResolver, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
