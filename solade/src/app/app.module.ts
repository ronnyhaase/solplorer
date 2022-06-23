import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RequestLoggerMiddleware } from '~/common/middleware/request-logger.middleware';
import { DbModule } from '~/db/db.module';
import { MarketsModule } from '~/markets/markets.module';
import { SolanaModule } from '~/solana/solana.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DbModule,
    MarketsModule,
    SolanaModule,
  ],
  exports: [],
  providers: [],
  controllers: [
    AppController,
  ],
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
