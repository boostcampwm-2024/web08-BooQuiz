// test/quiz-zone.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';

describe('QuizZoneController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.use(
      session({
        secret: 'my-secret',
        resave: true,
        saveUninitialized: true,
      }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/quiz-zone', () => {
    it('POST /quiz-zone should create new quiz zone', () => {
      return request(app.getHttpServer())
        .post('/quiz-zone')
        .expect(201);
    });
  });

  describe('Error cases', () => {
    it('POST /quiz-zone 중복 되면 에러', () => {
      request(app.getHttpServer()).post('/quiz-zone');
      return request(app.getHttpServer())
        .post('/quiz-zone')
        .expect(500);
    });
  });
});