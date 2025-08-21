/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/modules/app/app.module';
import { ConfigService } from '@nestjs/config';

import pipesConfig from '@config/pipes.config';
import { corsConfig } from '@config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const corsOptions = corsConfig(configService);

  app.enableCors(corsOptions);
  app.useGlobalPipes(pipesConfig);

  const port = configService.get<number>('PORT') || 3000;

  await app.listen(port, '0.0.0.0');
}

bootstrap();
