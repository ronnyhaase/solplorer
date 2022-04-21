import { Module } from '@nestjs/common';

import { SolanaCacheService } from './solana-cache.service';
import { SolanaController } from './solana.controller';
import { SolanaService } from './solana.service';

@Module({
  controllers: [SolanaController],
  imports: [],
  providers: [SolanaService, SolanaCacheService],
})
export class SolanaModule {}
