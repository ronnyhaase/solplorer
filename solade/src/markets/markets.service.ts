import { Injectable } from '@nestjs/common';
import got from 'got-cjs';

import { MarketData } from './types';

@Injectable()
export class MarketsService {
  async getSolanaData(): Promise<MarketData> {
    const [rawPriceData, rawHistoryData] = await Promise.all([
      got('https://api.coingecko.com/api/v3/simple/price', {
        searchParams: {
          ids: 'solana',
          vs_currencies: 'usd',
          include_market_cap: true,
          include_24hr_vol: true,
          include_24hr_change: true,
        },
      }).json(),
      got('https://api.coingecko.com/api/v3/coins/solana/market_chart', {
        searchParams: {
          vs_currency: 'usd',
          days: 13,
          interval: 'daily',
        },
      }).json(),
    ]);

    return {
      price: parseFloat(rawPriceData.solana.usd.toFixed(2)),
      volume: Math.round(rawPriceData.solana.usd_24h_vol),
      change: parseFloat(rawPriceData.solana.usd_24h_change.toFixed(1)),
      marketCap: Math.round(rawPriceData.solana.usd_market_cap),
      history: rawHistoryData.prices.map((_, n) => ({
        ts: rawHistoryData.prices[n][0],
        price: rawHistoryData.prices[n][1],
        volume: rawHistoryData.total_volumes[n][1],
      })),
    };
  }
}
