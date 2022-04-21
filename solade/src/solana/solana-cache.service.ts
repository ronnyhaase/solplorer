import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { default as Cache } from 'cache-manager';
import got from 'got-cjs';

import { TvlData, Validator } from './types';

@Injectable()
class SolanaCacheService {
  private readonly logger = new Logger(SolanaCacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {
    this.cache.set(
      'tvl',
      {
        history: [],
        protocols: [],
        protocolsCount: 0,
        totalTvl: 0,
        updatedAt: 0,
      },
      { ttl: 0 },
    );
    this.cache.set('validators', [], { ttl: 0 });
    this.updateAll();
  }

  getTvl(): Promise<TvlData> {
    return this.cache.get('tvl');
  }

  getValidators(): Promise<Array<Validator>> {
    return this.cache.get('validators');
  }

  updateAll() {
    this.updateTvl();
    this.updateValidators();
  }

  async updateTvl() {
    const tvl = await got(`${process.env.STATIC_DATA_URL}/tvl.json`).json();
    this.cache.set('tvl', tvl, { ttl: 0 });
    this.logger.log('TVL updated and cached');
  }

  async updateValidators() {
    const validators = await got(
      `${process.env.STATIC_DATA_URL}/validators.json`,
    ).json();
    this.cache.set('validators', validators, { ttl: 0 });
    this.logger.log('Validators updated and cached');
  }
}

export { SolanaCacheService };
