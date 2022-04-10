import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { default as Cache } from 'cache-manager';
import got from 'got-cjs';

import { Validator } from './types';

@Injectable()
class SolanaValidatorsService {
  private readonly logger = new Logger(SolanaValidatorsService.name);

  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {
    this.cache.set('validators', [], { ttl: 0 })
    this.update();
  }

  getValidators(): Promise<Array<Validator>> {
    return this.cache.get('validators');
  }

  async update() {
    const validators = await got(
      `${process.env.STATIC_DATA_URL}/validators.json`,
    ).json();
    this.cache.set('validators', validators, { ttl: 0 });
    this.logger.log('Validators updated and cached')
  }
}

export { SolanaValidatorsService };
