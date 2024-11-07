import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import TestAgent from 'supertest/lib/agent';

describe('QuizZoneController (e2e)', () => {
    let app: INestApplication;
    let agent: TestAgent; // agent 추가

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
            }),
        );

        await app.init();

        agent = request.agent(app.getHttpServer());
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Error cases', () => {
        it('POST /quiz-zone 중복 되면 에러', async () => {
            await agent.post('/quiz-zone').expect(201); // 첫 번째 요청
            await agent.post('/quiz-zone').expect(409); // 두 번째 요청 (중복 에러)
        });
    });
});
