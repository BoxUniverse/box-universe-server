import { Global, Module } from '@nestjs/common';

import { RedisPubSub } from 'graphql-redis-subscriptions';

export const PUB_SUB = 'PUBSUB';
@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      useFactory: () => {
        return new RedisPubSub({
          connection: {
            host: 'redis',
            port: 6379,
          },
        });
      },
    },
  ],
  exports: [PUB_SUB],
})
export class PubSubModule {}
