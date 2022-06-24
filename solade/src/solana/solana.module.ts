import { Module } from '@nestjs/common';

import { SolanaController } from './solana.controller';

@Module({
  imports: [],
  exports: [],
  providers: [],
  controllers: [SolanaController],
})
export class SolanaModule {}
