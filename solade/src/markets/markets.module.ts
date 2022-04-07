import { Module } from '@nestjs/common';
import { MarketsController } from './markets.controller';
import { MarketsService } from './markets.service';

@Module({
  imports: [],
  controllers: [MarketsController],
  providers: [MarketsService],
})
export class MarketsModule {}
