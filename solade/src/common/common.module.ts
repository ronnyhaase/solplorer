import { Module } from '@nestjs/common';

import { LogtailLogger } from './logtail-logger.service';

@Module({
  providers: [LogtailLogger],
  exports: [LogtailLogger],
})
class CommonModule {}

export { CommonModule };
