import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { compact, flattenDeep } from 'lodash';

@Injectable()
export class CacheHelpersService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getSocketIdsByProfiles(profiles: string[]): Promise<string[]> {
    const promise: Array<Promise<string[]>> = [];
    for (const profile of profiles) {
      promise.push(this.cacheManager.get<string[]>(profile));
    }
    return compact(flattenDeep<string[]>(await Promise.all(promise)));
  }
}
