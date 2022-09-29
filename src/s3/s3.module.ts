import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';

@Module({
  providers: [S3Service],
  imports: [
    BullModule.registerQueue({
      name: 'upload-queue',
    }),
  ],
  exports: [S3Service, BullModule],
})
export class S3Module {}
