import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType} from '@redis/client';

@Injectable()
export class DbService implements OnModuleDestroy {
  private readonly logger: Logger = new Logger(DbService.name);
  private db: RedisClientType = null;

  constructor(private configService: ConfigService) {
    const url = this.configService.get('REDIS_URL')
    this.db = createClient({ url });
    this.db.connect()
      .then(() => this.logger.log(`Connected to Redis ${
          (this.db.options.socket as any).host
        }:${
          (this.db.options.socket as any).port
      }`));
  }

  onModuleDestroy() {
    this.logger.log('Received shutdown signal, disconnecting from Redis...');
    this.db.disconnect()
      .then(() => this.logger.log('Disconnected from Redis'));
  }

  getEpoch() {
    return this.db.get('epoch');
  }

  getMarkets() {
    return this.db.get('markets');
  }

  getNews() {
    return this.db.get('news');
  }

  getStats() {
    return this.db.get('stats');
  }

  getSupply() {
    return this.db.get('supply');
  }

  getTokens() {
    return this.db.get('tokens');
  }

  getTvl() {
    return this.db.get('tvl');
  }

  getValidators() {
    return this.db.get('validators');
  }
}
