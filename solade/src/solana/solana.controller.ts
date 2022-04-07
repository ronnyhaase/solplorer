import { Controller, Get, MessageEvent, Sse } from '@nestjs/common';
import { SlotInfo } from '@solana/web3.js';
import { map, Observable } from 'rxjs';

import { Epoch, Validator } from './types';
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
  getSlotSSE(/* @Query('token') token: string */): Observable<MessageEvent> {
    // if (!token) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    return this.solanaService
      .subscribeSlotChanges()
      .pipe(map((slot) => ({ data: slot })));
  }

  @Get('/validators')
  async getValidators(): Promise<Array<Validator>> {
    return this.solanaService.getValidators();
  }
}
