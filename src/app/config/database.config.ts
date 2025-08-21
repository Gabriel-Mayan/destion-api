import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (config: ConfigService): TypeOrmModuleOptions => {
  const useSSL = config.get<string>('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false;
  const useLogger = config.get<string>('DB_LOGGER') === 'true';
  const useSynchronize = config.get<string>('DB_SYNCHRONIZE') === 'true';
  const dbPort = Number(config.get('DB_PORT') || 5432);
  const dbMaxConnections = Number(config.get('DB_MAX_CONNECTION') || 10);

  return {
    type: config.get<'postgres' | 'mysql'>('DB_CLIENT'),
    url: config.get<string>('DB_URL'),
    host: config.get<string>('DB_HOST'),
    port: dbPort,
    username: config.get<string>('DB_USERNAME'),
    password: config.get<string>('DB_PASSWORD'),
    database: config.get<string>('DB_DATABASE'),
    ssl: useSSL,
    logging: useLogger,
    synchronize: useSynchronize,
    entities: [__dirname + '/../modules/**/*.entity.{js,ts}'],
    extra: { max: dbMaxConnections },
  };
};
