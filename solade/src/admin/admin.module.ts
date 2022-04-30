import { Module } from '@nestjs/common';

import { SolanaModule } from '~/solana/solana.module';
import { AdminController } from './admin.controller';

@Module({
  controllers: [AdminController],
  imports: [SolanaModule],
  providers: [],
})
export class AdminModule {}
