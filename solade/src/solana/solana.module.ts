import { Module } from '@nestjs/common';

import { SolanaController } from './solana.controller';
import { SolanaService } from './solana.service';

@Module({
  imports: [],
  exports: [],
  providers: [SolanaService],
  controllers: [SolanaController],
})
export class SolanaModule {}
