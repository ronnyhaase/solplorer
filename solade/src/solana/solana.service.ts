import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Connection,
  ConnectionConfig,
  EpochInfo,
  clusterApiUrl,
  SlotInfo,
} from '@solana/web3.js';
import { BehaviorSubject, Observable } from 'rxjs';

import { Epoch, Validator } from './types';
import { AVG_SLOTTIME } from './constants';
import { SolanaValidatorsService } from './solana-validators.service';

@Injectable()
export class SolanaService {
  private slotChangeStream: BehaviorSubject<SlotInfo>;

  private client: Connection;

  constructor(
    private configService: ConfigService,
    private validatorsService: SolanaValidatorsService,
  ) {
    const url: string = this.configService.get('SOLANA_API_URL')
      || clusterApiUrl('mainnet-beta');
    const key: string = this.configService.get('SOLANA_API_KEY');

    const config: ConnectionConfig = {};
    if (key) config.httpHeaders = { Authorization: key };
    this.client = new Connection(url, config);

    this.slotChangeStream = new BehaviorSubject(null);
    this.client.onSlotChange((slot) => this.slotChangeStream.next(slot));
  }

  async getEpochInfo(): Promise<Epoch> {
    const rawEpochInfo: EpochInfo = await this.client.getEpochInfo();

    return {
      currentEpoch: rawEpochInfo.epoch,
      nextEpoch: rawEpochInfo.epoch + 1,
      epochSlotCurrent: rawEpochInfo.slotIndex,
      epochSlotTarget: rawEpochInfo.slotsInEpoch,
      epochETA:
        (rawEpochInfo.slotsInEpoch - rawEpochInfo.slotIndex) * AVG_SLOTTIME,
      epochProgress: Math.round(
        (rawEpochInfo.slotIndex / rawEpochInfo.slotsInEpoch) * 100,
      ),
      slotHeightTotal: rawEpochInfo.absoluteSlot,
      transactionsTotal: rawEpochInfo.transactionCount,
    };
  }

  getLatestSlot(): SlotInfo {
    return this.slotChangeStream.getValue();
  }

  subscribeSlotChanges(): Observable<SlotInfo> {
    return this.slotChangeStream.asObservable();
  }

  async getValidators(): Promise<Array<Validator>> {
    return this.validatorsService.getValidators();
  }
}
