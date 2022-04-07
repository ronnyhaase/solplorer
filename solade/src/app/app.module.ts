import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SolanaModule } from '~/solana/solana.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ isGlobal: true }),
    SolanaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
