import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { createTransport, Transporter } from 'nodemailer';

import { config } from './email.config';
import { ISendMail } from './email.interface';

@Injectable()
export class EmailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>;

  constructor(private configService: ConfigService) {
    this.transporter = createTransport(config(this.configService));
  }

  private compileTemplate(templateName: string, data: object): string {
    const templatePath = path.join(__dirname, 'templates', templateName);
    const source = fs.readFileSync(templatePath, 'utf-8');
    const compiled = handlebars.compile(source);

    return compiled(data);
  }

  async sendTestEmail(to: string, name: string) {
    const html = this.compileTemplate('test-email.hbs', { name });

    return await this.transporter.sendMail({
      to,
      from: `"Nest Test" <${this.configService.get<string>('EMAIL_DEFAULT_RECIVER_PROPOSE')}>`,
      subject: 'Test Email with NestJS',
      html,
    });
  }

  async sendMail({ to, subject, template, context }: ISendMail) {
    const html = this.compileTemplate(template, context);

    return await this.transporter.sendMail({
      to,
      from: this.configService.get<string>('EMAIL_USER'),
      html,
      subject,
    });
  }
}
