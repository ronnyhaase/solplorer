import { Controller, Get, Header, HttpException, HttpStatus, Logger, Param, Query } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString,  } from 'class-validator';
import {get} from 'lodash'

import { InvalidAddressError } from '~/common/errors';
import { DbService } from '~/db/db.service';
import { SolanaService } from './solana.service';

class GetNftCollectionsQuery {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset: number;

  @IsString()
  @IsOptional()
  @IsIn([
    '+marketCap',      '-marketCap',
    '+name',           '-name',
    '+price.avg',      '-price.avg',
    '+price.floor',    '-price.floor',
    '+price.max',      '-price.max',
    '+supply.holders', '-supply.holders',
    '+supply.listed',  '-supply.listed',
    '+supply.total',   '-supply.total',
    '+volume.1h',      '-volume.1h',
    '+volume.24h',     '-volume.24h',
    '+volume.7day',    '-volume.7day',
  ])
  orderBy: string;

  @IsString()
  @IsOptional()
  q: string;
}

@Controller('/')
export class SolanaController {
  private readonly logger: Logger = new Logger(SolanaController.name);

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

  @Get('nft-collections')
  @Header('content-type', 'application/json; charset=utf-8')
  async getNftCollections(
    @Query() query: GetNftCollectionsQuery,
  ): Promise<any> {
    const start = global.performance.now();

    const response = JSON.parse(
      await this.dbService.getNftCollections()
    );
    let data = response.data;
    let orderBy = 'marketCap';
    let orderDirection = 'DESC';
    let filters: any = {};

    // Search
    if (query.q) {
      filters.q = query.q;
      data = data.filter(collection => {
        return collection.name && collection.name.toLowerCase().indexOf(query.q.toLowerCase()) !== -1;
      });
    }

    // Sorting
    if (query.orderBy && query.orderBy !== '-marketCap') {
      orderBy = query.orderBy.slice(1);
      orderDirection = query.orderBy[0] === '+' ? 'ASC' : 'DESC';

      data = data.sort((colA, colB) => {
        let a = get(colA, orderBy);
        let b = get(colB, orderBy);

        if (a === null && typeof b === 'number') a = Number.MIN_SAFE_INTEGER;
        if (a === null && typeof b === 'string') a = String.fromCodePoint(0x10ffff);
        if (typeof a === 'number' && b === null) b = Number.MIN_SAFE_INTEGER;
        if (typeof a === 'string' && b === null) b = String.fromCodePoint(0x10ffff);

        if (a < b) return (orderDirection === 'ASC') ? -1 : 1
        else if (a > b) return (orderDirection === 'ASC') ? 1 : -1
        else return 0;
      })
    }

    // Pagination
    const limit = query.limit || 100;
    const offset = query.offset || 0;
    const count = data.length;
    data = data.slice(offset, offset + limit);

    const stop = global.performance.now();
    this.logger.log(`getNftCollections performance: ${Math.round(stop-start)}ms`);

    return {
      meta: { offset, limit, count, orderBy, orderDirection, filters },
      data,
      count,
      type: "list",
      updatedAt: response.updatedAt,
    };
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

  @Get('top10')
  @Header('content-type', 'application/json; charset=utf-8')
  async getTop10(): Promise<string> {
    return this.dbService.getTop10();
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
