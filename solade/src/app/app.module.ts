import { CacheModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AdminModule } from '~/admin/admin.module';
import { RequestLoggerMiddleware } from '~/common/middleware/request-logger.middleware';
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware)
      .exclude(
        { path: 'health', method: RequestMethod.GET },
        { path: 'health', method: RequestMethod.HEAD },
      )
      .forRoutes('*')
  }
}
