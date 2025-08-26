// test/performance/auth.performance.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app/modules/app/app.module';

describe('Auth Performance', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // Fecha o app e aguarda timers assíncronos limpos
    await app.close();
    await new Promise((r) => setTimeout(r, 100));
  });

  it('100 logins simultâneos em batches', async () => {
    const start = Date.now();
    const TOTAL_LOGINS = 100;
    const BATCH_SIZE = 20; // executa em lotes para não sobrecarregar

    for (let i = 0; i < TOTAL_LOGINS; i += BATCH_SIZE) {
      await Promise.all(
        Array.from({ length: BATCH_SIZE }).map(() =>
          request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'user@test.com', password: 'password123' }),
        ),
      );
    }

    const duration = Date.now() - start;
    console.log(`⏱️ 100 logins completados em batches: ${duration}ms`);

    // Ajuste o tempo limite conforme sua máquina
    expect(duration).toBeLessThan(5000);
  });
});
