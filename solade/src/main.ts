import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { LogtailLogger } from './common/logtail-logger.service';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const closeGracefully = async (signal: string) => {
    console.log(
      `[${new Date().toISOString()}] Received signal to terminate: ${signal}`,
    );
    await app.close();
    process.kill(process.pid, signal);
  };
  process.once('SIGINT', closeGracefully);
  process.once('SIGTERM', closeGracefully);

  app.useLogger(
    process.env.NODE_ENV === 'production'
      ? new LogtailLogger()
      : new ConsoleLogger(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(',')
      : false,
  });
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.enableShutdownHooks();
  await app.listen(parseInt(process.env.PORT) | 3000);
})();
