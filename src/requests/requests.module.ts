import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsResolver } from './requests.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestSchema, Request } from './requests.schema';
import { RequestsRepository } from './requests.repository';
import { RequestsGateway } from './requests.gateway';
import { ProfilesModule } from '@profiles/profiles.module';

@Module({
  providers: [RequestsService, RequestsResolver, RequestsRepository, RequestsGateway],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Request.name,
        useFactory: () => {
          const schema = RequestSchema;
          return schema;
        },
      },
    ]),
    ProfilesModule,
  ],

  exports: [RequestsService, RequestsResolver, RequestsRepository],
})
export class RequestsModule {}
