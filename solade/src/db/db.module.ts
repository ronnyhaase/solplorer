import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';

@Global()
@Module({
  imports: [],
  exports: [DbService],
  providers: [DbService],
  controllers: [],
})
export class DbModule {}
