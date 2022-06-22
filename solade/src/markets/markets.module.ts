import { Module } from '@nestjs/common';

import { DbModule } from '~/db/db.module';
import { DbService } from '~/db/db.service';
import { MarketsController } from './markets.controller';

@Module({
  imports: [DbModule],
  controllers: [MarketsController],
  providers: [DbService],
})
export class MarketsModule {}
