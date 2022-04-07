import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MarketsModule } from '~/markets/markets.module';
import { SolanaModule } from '~/solana/solana.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true }),
    MarketsModule,
    SolanaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
