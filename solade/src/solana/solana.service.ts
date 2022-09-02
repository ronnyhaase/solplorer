import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as solana from '@solana/web3.js';
import { InvalidAddressError } from '~/common/errors';
import { buildStandardAccount, buildTokenAccount, buildVoteAccount } from './accounts';
import { buildBlock } from './blocks';

@Injectable()
export class SolanaService {
  private readonly logger: Logger = new Logger(SolanaService.name);
  private readonly solanaClient: solana.Connection;

  constructor(private configService: ConfigService) {
    const apiUrl = this.configService.get('SOLANA_API_URL');
    this.solanaClient = new solana.Connection(apiUrl);
    this.solanaClient.getVersion().then(version => {
      this.logger.log(`Connected to Solana RPC ${apiUrl}, version: ${version['solana-core']}.${version['feature-set']}`)
    });
  }

  async getBlock(blockNumber: number) {
    const rawBlock: solana.BlockResponse = await this.solanaClient.getBlock(blockNumber);

    return buildBlock(blockNumber, rawBlock);
  }

  async getAccount(address: string) {
    let accKey: solana.PublicKey;
    try {
      accKey = new solana.PublicKey(address);
    } catch (error) {
      throw new InvalidAddressError('Invalid account address');
    }

    const account: any = (await this.solanaClient.getParsedAccountInfo(accKey)).value;
    const programType: string = account.data.program;

    if (address === 'NativeLoader1111111111111111111111111111111') {
      return {
        executable: null,
        balance: 0,
        rentEpoch: null,
        owner: {
          address: null,
          name: null,
        },
      }
    }
    if (!programType) return buildStandardAccount(address, account);
    switch (programType) {
      case 'spl-token': return buildTokenAccount(address, account);
      case 'vote': return buildVoteAccount(address, account);
      default: return buildStandardAccount(address, account);
    }
  }

  async getTransaction(signature: string) {
    const transaction = await this.solanaClient.getParsedTransaction(signature);

    return {
      _raw: transaction,
    };
  }
}
