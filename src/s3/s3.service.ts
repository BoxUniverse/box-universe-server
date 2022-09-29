import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { FileUpload } from 'graphql-upload';
import { File } from '@graphql/types/File';

type FileImage = Omit<FileUpload, 'createReadStream'> & { buffer: Buffer };
@Injectable()
export class S3Service {
  async uploadImage(file: FileUpload): Promise<Error | string> {
    let { filename, encoding, mimetype, createReadStream } = file;
    const s3 = new S3();
    const stream = createReadStream();
    const chunks = [];

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      let buffer: Buffer;

      stream.on('data', function (chunk) {
        chunks.push(chunk);
      });

      stream.on('end', function () {
        buffer = Buffer.concat(chunks);
        resolve(buffer);
      });

      stream.on('error', reject);
    });

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
