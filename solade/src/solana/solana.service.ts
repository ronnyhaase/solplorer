import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Connection,
  ConnectionConfig,
  EpochInfo,
  clusterApiUrl,
  SlotInfo,
  Supply as SolanaSupply,
} from '@solana/web3.js';
import { BehaviorSubject, Observable } from 'rxjs';

import { CoinsData, Epoch, Supply, TvlData, ValidatorsData } from './types';
import { AVG_SLOTTIME, SOL_PER_LAMPORT } from './constants';
import { SolanaCacheService } from './solana-cache.service';

@Injectable()
export class SolanaService {
  private slotChangeStream: BehaviorSubject<SlotInfo>;

  private client: Connection;

  constructor(
    private configService: ConfigService,
    private chacheService: SolanaCacheService,
  ) {
    const url: string =
      this.configService.get('SOLANA_API_URL') || clusterApiUrl('mainnet-beta');
    const key: string = this.configService.get('SOLANA_API_KEY');

    const config: ConnectionConfig = {};
    if (key) config.httpHeaders = { Authorization: key };
    this.client = new Connection(url, config);

    this.slotChangeStream = new BehaviorSubject(null);
    this.client.onSlotChange((slot) => this.slotChangeStream.next(slot));
  }

  async getCoins(): Promise<CoinsData> {
    return this.chacheService.getCoins();
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

  async getSupply(): Promise<Supply> {
    const supply: SolanaSupply = (
      await this.client.getSupply({ excludeNonCirculatingAccountsList: true })
    ).value;
    const validators: ValidatorsData =
      await this.chacheService.getValidators();

    let activeStake = 0;
    let delinquentsStake = 0;
    validators.validators.forEach((validator) => {
      if (validator.delinquent) delinquentsStake += validator.activatedStake;
      else activeStake += validator.activatedStake;
    });

    return {
      circulating: supply.circulating * SOL_PER_LAMPORT,
      nonCirculating: supply.nonCirculating * SOL_PER_LAMPORT,
      total: supply.total * SOL_PER_LAMPORT,
      circulatingPercent: (supply.circulating / supply.total) * 100,
      activeStake: Math.round(activeStake * SOL_PER_LAMPORT),
      delinquentsStake: Math.round(delinquentsStake * SOL_PER_LAMPORT),
      activeStakePercent: (activeStake / supply.total) * 100,
      delinquentsStakePercent: (delinquentsStake / supply.total) * 100,
    };
  }

  async getTvl(): Promise<TvlData> {
    return this.chacheService.getTvl();
  }

  async getValidators(): Promise<ValidatorsData> {
    return this.chacheService.getValidators();
  }

  subscribeSlotChanges(): Observable<SlotInfo> {
    return this.slotChangeStream.asObservable();
  }
}
