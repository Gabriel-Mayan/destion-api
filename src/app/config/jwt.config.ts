import { ConfigService } from '@nestjs/config';

export const jwtConfig = (config: ConfigService) => ({
    secret: config.get<string>('JWT_SECRET'),
    signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') || '1h' },
})
