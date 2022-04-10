import { Controller, Get, MessageEvent, Sse } from '@nestjs/common';
import { SlotInfo } from '@solana/web3.js';
import { map, Observable } from 'rxjs';

import { Epoch, Supply, Validator } from './types';
import { SolanaService } from './solana.service';

@Controller('/solana')
export class SolanaController {
  constructor(private solanaService: SolanaService) {}

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

  @Get('/validators')
  async getValidators(): Promise<Array<Validator>> {
    return this.solanaService.getValidators();
  }
}
