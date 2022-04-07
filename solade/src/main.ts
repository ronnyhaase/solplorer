import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  await app.listen(parseInt(process.env.PORT) | 3000);
})();
