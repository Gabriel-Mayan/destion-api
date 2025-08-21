import { ConfigService } from '@nestjs/config';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';

export const config = (config: ConfigService): SMTPTransport.Options => ({
  host: config.get<string>('EMAIL_HOST'),
  port: Number(config.get<string>('EMAIL_PORT') ?? 465),
  service: config.get<string>('EMAIL_SERVICE'),
  auth: {
    user: config.get<string>('EMAIL_USER'),
    pass: config.get<string>('EMAIL_PASS'),
  },
});
