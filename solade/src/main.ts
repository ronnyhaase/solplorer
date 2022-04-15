import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : false,
  });
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  await app.listen(parseInt(process.env.PORT) | 3000);
})();
