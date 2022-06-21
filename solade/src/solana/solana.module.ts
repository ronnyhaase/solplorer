import { Module } from '@nestjs/common';

import { DbModule } from '~/db/db.module';
import { DbService } from '~/db/db.service';
import { SolanaCacheService } from './solana-cache.service';
import { SolanaController } from './solana.controller';
import { SolanaService } from './solana.service';

@Module({
  controllers: [SolanaController],
  exports: [SolanaCacheService],
  imports: [DbModule],
  providers: [DbService, SolanaService, SolanaCacheService],
})
export class SolanaModule {}
