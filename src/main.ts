import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
// import * as csurf from 'csurf';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as os from 'os';
import { MongoExceptionFilter } from '@filters/mongo.filter';
import { config } from 'aws-sdk';
import { graphqlUploadExpress } from 'graphql-upload';
import { RedisIoAdapter } from './common/adapters/redis.adapter';

declare const module: any;
async function bootstrap() {
  const cpus = os.cpus().length;
  process.env.UV_THREADPOOL_SIZE = cpus.toString();

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);
  config.update({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: 'ap-southeast-1',
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new MongoExceptionFilter());
  app.use(compression());
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  bodyParser.urlencoded({ extended: false });
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(graphqlUploadExpress({ maxFileSize: 2 * 1000 * 1000, maxFiles: 10 }));
  // app.use(csurf({ cookie: true }));
  await app.listen(process.env.PORT);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
