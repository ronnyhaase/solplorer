import { Module } from '@nestjs/common';
import { CoinGeckoClient } from './coingecko-client.service';

@Module({
  providers: [CoinGeckoClient],
})
export class ClientsModule {}
