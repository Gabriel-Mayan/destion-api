import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';

export const corsConfig = (configService: ConfigService): CorsOptions => {
  const mode = configService.get<string>('NODE_ENV');
  const whitelist = [''];

  return {
    origin: mode !== 'production' ? true : whitelist,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Date',
      'Origin',
      'Accept',
      'Cookie',
      'Set-Cookie',
      'X-XSRF-TOKEN',
      'Accept-Language',
    ],
  };
};
