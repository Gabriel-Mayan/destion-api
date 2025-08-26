import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthController } from '../../src/app/modules/auth/auth.controller';
import { AuthService } from '../../src/app/modules/auth/auth.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const authServiceMock = {
    register: jest.fn(),
    login: jest.fn(),
    socialLogin: jest.fn(),
    requestPasswordRecovery: jest.fn(),
    changePassword: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST)', async () => {
    const dto = { email: 'test@test.com', password: '123456' };
    const mockUser = { id: 'user1', email: dto.email };
    authServiceMock.register.mockResolvedValue(mockUser);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(dto)
      .expect(201)
      .expect(res => expect(res.body).toEqual(mockUser));
  });

  it('/auth/login (POST)', async () => {
    const dto = { email: 'test@test.com', password: '123456' };
    const mockToken = { accessToken: 'token123' };
    authServiceMock.login.mockResolvedValue(mockToken);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send(dto)
      .expect(201)
      .expect(res => expect(res.body).toEqual(mockToken));
  });

  it('/auth/social-login (POST)', async () => {
    const dto = { provider: 'google', token: 'token123' };
    const mockUser = { id: 'user1', email: 'social@test.com' };
    authServiceMock.socialLogin.mockResolvedValue(mockUser);

    await request(app.getHttpServer())
      .post('/auth/social-login')
      .send(dto)
      .expect(201)
      .expect(res => expect(res.body).toEqual(mockUser));
  });

  it('/auth/request-password-recovery (POST)', async () => {
    const dto = { email: 'test@test.com' };
    const mockResult = { success: true };
    authServiceMock.requestPasswordRecovery.mockResolvedValue(mockResult);

    await request(app.getHttpServer())
      .post('/auth/request-password-recovery')
      .send(dto)
      .expect(201)
      .expect(res => expect(res.body).toEqual(mockResult));
  });

  it('/auth/change-password (POST)', async () => {
    const dto = { token: 'token123', newPassword: 'newpass' };
    const mockResult = { success: true };
    authServiceMock.changePassword.mockResolvedValue(mockResult);

    await request(app.getHttpServer())
      .post('/auth/change-password')
      .send(dto)
      .expect(201)
      .expect(res => expect(res.body).toEqual(mockResult));
  });
});
