import { Controller, Get, MessageEvent, Sse } from '@nestjs/common';
import { SlotInfo } from '@solana/web3.js';
import { map, Observable } from 'rxjs';

import { CoinsData, Epoch, Supply, TvlData, Validator, ValidatorsData } from './types';
import { SolanaService } from './solana.service';

@Controller('/solana')
export class SolanaController {
  constructor(private solanaService: SolanaService) {}

  @Get('/coins')
  async getCoins(): Promise<CoinsData> {
    return this.solanaService.getCoins();
  }

  @Get('/epoch')
  async getEpoch(): Promise<Epoch> {
    return this.solanaService.getEpochInfo();
  }

  @Get('/slot')
  getSlot(): SlotInfo {
    return this.solanaService.getLatestSlot();
  }

  @Sse('/sse/slot')
  getSlotSSE(): Observable<MessageEvent> {
    return this.solanaService
      .subscribeSlotChanges()
      .pipe(map((slot) => ({ data: slot })));
  }

  @Get('/supply')
  getSupply(): Promise<Supply> {
    return this.solanaService.getSupply();
  }

  @Get('/tvl')
  getTvl(): Promise<TvlData> {
    return this.solanaService.getTvl();
  }

  @Get('/validators')
  async getValidators(): Promise<ValidatorsData> {
    return this.solanaService.getValidators();
  }
}
