import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../../src/integrations/email/email.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../src/app/modules/user/user.entity';

// --- Mocks ---
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({ sendMail: jest.fn().mockResolvedValue(true) })),
}));
jest.mock('fs', () => ({ readFileSync: jest.fn(() => '<h1>{{name}}</h1>') }));
jest.mock('handlebars', () => ({ compile: jest.fn(() => (context: any) => `<h1>${context.name}</h1>`) }));

describe('EmailService Performance', () => {
  let service: EmailService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key) => ({
              EMAIL_USER: 'no-reply@test.com',
              FRONTEND_URL: 'http://localhost:3000',
            }[key])),
          },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('envio de 50 e-mails deve responder rapidamente', async () => {
    const user = { name: 'Gabriel', email: 'gabriel@test.com' } as User;
    const start = Date.now();

    await Promise.all(Array.from({ length: 50 }).map(() => service.sendRecoveryEmail(user, 'token123', new Date())));

    const duration = Date.now() - start;
    console.log(`⏱️ Tempo de envio de 50 emails: ${duration}ms`);
    expect(duration).toBeLessThan(1500);
  });

  it('envio de 100 e-mails simultâneos', async () => {
    const user = { name: 'Gabriel', email: 'gabriel@test.com' } as User;
    const start = Date.now();

    await Promise.all(Array.from({ length: 100 }).map(() => service.sendRecoveryEmail(user, 'token456', new Date())));

    const duration = Date.now() - start;
    console.log(`⏱️ Tempo de envio de 100 emails: ${duration}ms`);
    expect(duration).toBeLessThan(3000);
  });
});
