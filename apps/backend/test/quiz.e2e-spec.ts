import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import TestAgent from 'supertest/lib/agent';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizModule } from '../src/quiz/quiz.module';
import { Quiz } from '../src/quiz/entity/quiz.entitiy';
import { QuizSet } from '../src/quiz/entity/quiz-set.entity';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { QUIZ_TYPE } from '../src/common/constants';
import { CreateQuizRequestDto } from '../src/quiz/dto/create-quiz-request.dto';

describe('QuizController (e2e)', () => {
    let app: INestApplication;
    let agent: TestAgent;
    let dataSource: DataSource;

    beforeAll(async () => {
        // 트랜잭션 컨텍스트 초기화
        initializeTransactionalContext();

        // NestJS 애플리케이션 생성
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
                TypeOrmModule.forRoot({
                    type: 'mysql',
                    host: 'localhost',
                    port: 3306,
                    username: 'root',
                    password: '',
                    database: 'test_db',
                    entities: [Quiz, QuizSet],
                    synchronize: true, // 테스트 시 스키마 동기화
                }),
                QuizModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        dataSource = app.get(DataSource);
        agent = request.agent(app.getHttpServer());

        await dataSource.synchronize(true);

        // 초기 데이터 삽입
        const quizSetRepository = dataSource.getRepository(QuizSet);
        const quizRepository = dataSource.getRepository(Quiz);

        // QuizSet 데이터 삽입
        const quizSet = await quizSetRepository.save({
            id: 1,
            name: '테스트 퀴즈셋',
        });

        // Quiz 데이터 삽입
        await quizRepository.save({
            id: 1,
            question: '테스트 퀴즈 질문',
            answer: '테스트 정답',
            playTime: 5000,
            quizType: QUIZ_TYPE.SHORT_ANSWER,
            quizSet,
        });
    });

    afterAll(async () => {
        if (dataSource && dataSource.isInitialized) {
            await dataSource.destroy();
        }
        await app.close();
    });

    describe('Error cases', () => {
        it('퀴즈 리스트 반환 요청 - 존재하지 않는 QuizSetId로 요청 시 404 반환', async () => {
            const nonExistentQuizSetId = 10;
            const response = await agent.get(`/quiz/${nonExistentQuizSetId}`).expect(400);

            expect(response.body).toEqual({
                statusCode: 400,
                message: '해당 퀴즈셋을 찾을 수 없습니다.',
                error: 'Bad Request',
            });
        });

        it('퀴즈 생성 요청 - 존재하지 않는 퀴즈셋 id로 저장 요청 -> 400 반환', async () => {
            const quizSetId = 3;

            const quizData = {
                question: '테스트 퀴즈 질문',
                answer: '테스트 정답',
                playTime: 3000,
                quizType: 'SHORT_ANSWER',
            };

            await agent.post(`/quiz/${quizSetId}`).send(quizData).expect(400);
        });
    });

    describe('Success cases', () => {
        it('정상적으로 퀴즈 리스트 반환', async () => {
            const quizSetId = 1;

            const response = await agent.get(`/quiz/${quizSetId}`).expect(200);

            expect(response.body).toEqual(
                expect.arrayContaining([
                    {
                        id: expect.any(Number),
                        question: expect.any(String),
                        answer: expect.any(String),
                        playTime: expect.any(Number),
                        quizType: expect.any(String),
                    },
                ]),
            );
        });

        // 수정 필요
        it('새로운 퀴즈 추가 요청 성공', async () => {
            const quizSetId = 1;

            const quizData = {
                question: '지브리는 뭘로 돈 벌게요?',
                answer: '토토로',
                playTime: 30000,
                quizType: 'SHORT_ANSWER',
            } as CreateQuizRequestDto;

            const response = await agent.post(`/quiz/${quizSetId}`).send(quizData);

            expect(response.body).toEqual({
                id: expect.any(Number),
            });
        });
    });
});
