import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { S3 } from 'aws-sdk';

@Processor('upload-queue')
export class S3Processor {
  constructor() {}

  @Process('uploadFile')
  async handleUploadFile(job: Job) {
    const s3 = new S3();
    const { buffer, encoding, key, mimetype } = job.data;

    return await s3
      .upload({
        Bucket: process.env.AWS_S3_NAME_BUCKET,
        Body: buffer,
        ContentEncoding: encoding,
        Key: key,
        ContentType: mimetype,
      })
      .promise();
  }
}
