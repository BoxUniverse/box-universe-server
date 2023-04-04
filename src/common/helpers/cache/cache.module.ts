import { Global, Module } from '@nestjs/common';
import { CacheHelpersService } from '@helpers/cache';

@Global()
@Module({
  providers: [CacheHelpersService],
  exports: [CacheHelpersService],
})
export class CacheHelpersModule {}
