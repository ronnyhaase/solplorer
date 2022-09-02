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

  @Get('/blocks/:blockNo')
  async getBlock(@Param() params): Promise<any> {
    const blockNo = parseInt(params.blockNo);
    if (isNaN(blockNo) || blockNo < 0) {
      throw new HttpException('Invalid block number', HttpStatus.BAD_REQUEST);
    }

    let block = null;
    try {
      block = this.solanaService.getBlock(blockNo);
    } catch (error) {
      console.error(error)
      throw new HttpException('Fetching block data failed', HttpStatus.BAD_GATEWAY);
    }

    return block;
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

  @Get('/news')
  @Header('content-type', 'application/json; charset=utf-8')
  async getNews(): Promise<string> {
    return this.dbService.getNews();
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

  @Get('/tx/:signature')
  getTransaction(@Param() params): Promise<any> {
    return this.solanaService.getTransaction(params.signature);
  }

  @Get('/validators')
  @Header('content-type', 'application/json; charset=utf-8')
  async getValidators(): Promise<string> {
    return this.dbService.getValidators();
  }
}
