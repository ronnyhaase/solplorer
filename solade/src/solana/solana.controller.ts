import { Controller, Get, Header } from '@nestjs/common';

import { DbService } from '~/db/db.service';

@Controller('/solana')
export class SolanaController {
  constructor(private dbService: DbService) {}

  @Get('/coins')
  @Header('content-type', 'application/json; charset=utf-8')
  async getCoins(): Promise<string> {
    return this.dbService.getTokens();
  }

  @Get('/epoch')
  @Header('content-type', 'application/json; charset=utf-8')
  async getEpoch(): Promise<string> {
    return this.dbService.getEpoch();
  }

  @Get('/supply')
  @Header('content-type', 'application/json; charset=utf-8')
  getSupply(): Promise<string> {
    return this.dbService.getSupply();
  }

  @Get('/stats')
  @Header('content-type', 'application/json; charset=utf-8')
  getStats(): Promise<string> {
    return this.dbService.getStats();
  }

  @Get('/tvl')
  @Header('content-type', 'application/json; charset=utf-8')
  getTvl(): Promise<string> {
    return this.dbService.getTvl();
  }

  @Get('/validators')
  @Header('content-type', 'application/json; charset=utf-8')
  async getValidators(): Promise<string> {
    return this.dbService.getValidators();
  }
}
