import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { default as Cache } from 'cache-manager';
import got from 'got-cjs';

import { CoinsData, TvlData, ValidatorsData } from './types';

@Injectable()
class SolanaCacheService {
  private readonly logger = new Logger(SolanaCacheService.name);

  constructor(@Inject(CACHE_MANAGER) private cache: Cache) {
    this.cache.set('coins', { coins: [], count: 0, updatedAt: 0 }, { ttl: 0 })
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
    this.cache.set('validators', { count: 0, updatedAt: 0, validators: [] }, { ttl: 0 });
    this.updateAll();
  }

  getCoins(): Promise<CoinsData> {
    return this.cache.get('coins');
  }

  getTvl(): Promise<TvlData> {
    return this.cache.get('tvl');
  }

  getValidators(): Promise<ValidatorsData> {
    return this.cache.get('validators');
  }

  updateAll() {
    this.updateCoins();
    this.updateTvl();
    this.updateValidators();
  }

  async updateCoins() {
    const tvl = await got(`${process.env.STATIC_DATA_URL}/coins.json`).json();
    this.cache.set('coins', tvl, { ttl: 0 });
    this.logger.log('Coins updated and cached');
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
