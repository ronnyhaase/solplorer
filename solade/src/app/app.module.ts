import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdminModule } from '~/admin/admin.module';
import { MarketsModule } from '~/markets/markets.module';
import { SolanaModule } from '~/solana/solana.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true, ttl: 0 }),
    AdminModule,
    MarketsModule,
    SolanaModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {}
