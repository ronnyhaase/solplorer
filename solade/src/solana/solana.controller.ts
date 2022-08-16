import { Controller, Get, Header, HttpException, HttpStatus, Param } from '@nestjs/common';
import { InvalidAddressError } from '~/common/errors';

import { DbService } from '~/db/db.service';
import { SolanaService } from './solana.service';

@Controller('/')
export class SolanaController {
  constructor(
    private dbService: DbService,
    private solanaService: SolanaService,
  ) {}

  @Get('/accounts/:address')
  async getAccount(@Param() params): Promise<any> {
    let account
    try {
      account = await this.solanaService.getAccount(params.address);
    } catch (error) {
      if (error instanceof InvalidAddressError) {
        throw new HttpException('Invalid account address', HttpStatus.BAD_REQUEST);
      } else {
        throw error;
      }
    }
    return { data: account };
  }

  @Get('/tokens')
  @Header('content-type', 'application/json; charset=utf-8')
  async getCoins(): Promise<string> {
    return this.dbService.getTokens();
  }

  @Get('/epoch')
  @Header('content-type', 'application/json; charset=utf-8')
  async getEpoch(): Promise<string> {
    return this.dbService.getEpoch();
  }

  @Get('/markets')
  @Header('content-type', 'application/json; charset=utf-8')
  async getMarkets(): Promise<string> {
    return this.dbService.getMarkets();
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
