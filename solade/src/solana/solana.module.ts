import { Module } from '@nestjs/common';

import { DbModule } from '~/db/db.module';
import { DbService } from '~/db/db.service';
import { SolanaController } from './solana.controller';

@Module({
  controllers: [SolanaController],
  exports: [],
  imports: [DbModule],
  providers: [DbService],
})
export class SolanaModule {}
