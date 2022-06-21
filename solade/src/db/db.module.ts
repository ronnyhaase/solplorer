import { Module } from '@nestjs/common';
import { DbService } from './db.service';

@Module({
  imports: [],
  controllers: [],
  providers: [DbService],
})
export class DbModule {}
