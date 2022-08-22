import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { FileUpload } from 'graphql-upload';

type FileImage = Omit<FileUpload, 'createReadStream'> & { buffer: Buffer };

@Injectable()
export class S3Service {
  async uploadImage({ buffer, mimetype, encoding, filename }: FileImage): Promise<Error | string> {
    const s3 = new S3();

    const extensionFile = mimetype.replace('image/', '');
    filename = filename.replace(/\.(.*)$/g, '');

    return new Promise((resolve, reject) => {
      s3.upload(
        {
          Bucket: process.env.AWS_S3_NAME_BUCKET,
          Body: buffer,
          ContentEncoding: encoding,
          Key: `${filename}-${Date.now()}.${extensionFile}`,
          ContentType: mimetype,
        },
        (err: Error, data: ManagedUpload.SendData) => {
          if (err) return reject(err);
          return resolve(data.Location);
        },
      );
    });
  }
}
