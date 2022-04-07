import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { default as Cache } from 'cache-manager';
import got from 'got-cjs';

@Injectable()
class SolanaValidatorsService {
  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {
    this.update();
  }

  async getValidators() {
    return this.cache.get('validators');
  }

  async update() {
    const validators = await got(
      `${process.env.STATIC_DATA_URL}/validators.json`,
    ).json();
    this.cache.set('validators', validators, { ttl: 0 });
  }
}

export { SolanaValidatorsService };
