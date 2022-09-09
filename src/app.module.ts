import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './authentication/auth.module';
import { S3Service } from './s3/s3.service';
import { S3Module } from './s3/s3.module';
import { UsersService } from '@users/users.service';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      playground: true,
      csrfPrevention: false,
      cors: {
        origin: '*',
        credentials: true,
      },
      debug: true,
      path: '/',
      context: ({ req, res }) => ({ req, res }),
    }),
    UsersModule,
    AuthModule,
    S3Module,
    ProfilesModule,
  ],
  providers: [S3Service, UsersService],
})
export class AppModule {}
