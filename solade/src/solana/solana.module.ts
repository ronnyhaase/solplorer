import { Module } from '@nestjs/common';

import { SolanaValidatorsService } from './solana-validators.service';
import { SolanaController } from './solana.controller';
import { SolanaService } from './solana.service';

@Module({
  controllers: [SolanaController],
  imports: [],
  providers: [SolanaService, SolanaValidatorsService],
})
export class SolanaModule {}
