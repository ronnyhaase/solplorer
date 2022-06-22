import { Controller, Get } from '@nestjs/common';
import { DbService } from '~/db/db.service';

@Controller('/markets')
export class MarketsController {
  constructor(private dbService: DbService) {}

  @Get('/solana')
  getSolanaData(): Promise<string> {
    return this.dbService.getMarkets();
  }
}
