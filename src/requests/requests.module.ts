import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfilesModule } from '@src/profiles';
import {
  Request,
  RequestSchema,
  RequestsGateway,
  RequestsRepository,
  RequestsResolver,
  RequestsService,
} from '@src/requests';

@Module({
  providers: [RequestsService, RequestsResolver, RequestsRepository, RequestsGateway],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Request.name,
        useFactory: () => {
          return RequestSchema;
        },
      },
    ]),
    ProfilesModule,
  ],

  exports: [RequestsService, RequestsResolver, RequestsRepository],
})
export class RequestsModule {}
