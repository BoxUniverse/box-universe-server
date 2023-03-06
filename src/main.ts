import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { MongoExceptionFilter } from '@filters/mongo.filter';
import { config } from 'aws-sdk';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import { graphqlUploadExpress } from 'graphql-upload';
import helmet from 'helmet';
import * as os from 'os';
import { RedisIoAdapter } from '@common/adapters';
import { EventEmitter } from 'events';

declare const module: any;

async function bootstrap() {
  //

  const cpus = os.cpus().length;
  process.env.UV_THREADPOOL_SIZE = cpus.toString();
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });
  EventEmitter.setMaxListeners(0);

  app.enableCors({
    origin: '*',
    credentials: true,
  });
  process.setMaxListeners(200);
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
  app.use(bodyParser.json({ limit: '200mb' }));
  app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));

  app.use(bodyParser.text({ limit: '200mb' }));
  app.use(cookieParser());
  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(graphqlUploadExpress({ maxFileSize: 2000000, maxFiles: 20 }));
  // app.use(csurf({ cookie: true }));
  await app.listen(process.env.PORT);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
