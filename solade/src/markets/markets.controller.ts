import { Controller, Get } from '@nestjs/common';

import { MarketsService } from './markets.service';
import { MarketData } from './types';

@Controller('/markets')
export class MarketsController {
  constructor(private marketsService: MarketsService) {}

  @Get('/solana')
  getSolanaData(): Promise<MarketData> {
    return this.marketsService.getSolanaData();
  }
}
