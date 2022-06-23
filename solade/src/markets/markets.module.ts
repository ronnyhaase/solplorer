import { Module } from '@nestjs/common';

import { MarketsController } from './markets.controller';

@Module({
  imports: [],
  exports: [],
  providers: [],
  controllers: [MarketsController],
})
export class MarketsModule {}
