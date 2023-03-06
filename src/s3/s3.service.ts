import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { FileUpload } from 'graphql-upload';

import * as mime from 'mime-types';
@Injectable()
export class S3Service {
  async uploadImage(file: FileUpload): Promise<Error | string> {
    const { encoding, mimetype, createReadStream } = file;
    let filename = file.filename;
    const stream = createReadStream();
    const buffer = await this.streamToString(stream);
    const extensionFile = mimetype.replace('image/', '');
    filename = filename.replace(/\.(.*)$/g, '');
    return await this.upload(buffer, encoding, mimetype, filename, extensionFile);
  }
  async streamToString(stream) {
    const chunks = [];
    return new Promise<Buffer>((resolve, reject) => {
      let buffer: Buffer;

      stream.on('data', function (chunk) {
        chunks.push(chunk);
      });
      //
      stream.on('end', function () {
        buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
      //
      stream.on('error', reject);
    });
  }

  // async uploadMultipleImage(file: FileUpload) {
  //   const { encoding, mimetype, createReadStream } = file;
  //   let filename = file.filename;
  //   const stream = createReadStream();
  //   const buffer = await this.streamToString(stream);
  //   const extensionFile = mime.extension(mimetype);
  //   filename = filename.replace(/\.(.*)$/g, '');
  //   return await this.upload(buffer, encoding, mimetype, filename, extensionFile as string);
  // }
  //
  async upload(
    buffer: Buffer,
    encoding: string,
    mimetype: string,
    filename: string,
    extensionFile: string,
  ): Promise<Error | string> {
    const s3 = new S3();
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
