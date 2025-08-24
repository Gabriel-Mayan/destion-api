import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { createTransport, Transporter } from 'nodemailer';

import { User } from '@modules/user/user.entity';

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

  private async sendMail({ to, subject, template, context }: ISendMail) {
    const html = this.compileTemplate(template, context);

    return await this.transporter.sendMail({
      to,
      from: this.configService.get<string>('EMAIL_USER'),
      html,
      subject,
    });
  }

  async sendRecoveryEmail(user: User, token: string, expiresAt: Date) {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/recovery/${token}`;

    return this.sendMail({
      to: user.email,
      subject: 'Password Recovery',
      template: 'recovery-password.hbs',
      context: { name: user.name, resetUrl, expiresAt },
    });
  }
}
