import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const closeGracefully = async (signal: string) => {
    console.log(
      `[${new Date().toISOString()}] Received signal to terminate: ${signal}`,
    );
    await app.close();
    process.kill(process.pid, signal);
  };
  process.once('SIGINT', closeGracefully);
  process.once('SIGTERM', closeGracefully);

  app.enableCors({
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : false,
  });
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  await app.listen(parseInt(process.env.PORT) | 3000);
})();
