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
import { CreateQuizSetRequestDto } from '../src/quiz/dto/create-quiz-set-request.dto';
import { UpdateQuizRequestDto } from '../src/quiz/dto/update-quiz-request.dto';
import { beforeEach } from 'node:test';

describe('QuizController (e2e)', () => {
    let app: INestApplication;
    let agent: TestAgent;
    let dataSource: DataSource;
    let quiz: Quiz;
    let quizSet: QuizSet;

    beforeAll(async () => {
        // 트랜잭션 컨텍스트 초기화
        initializeTransactionalContext();

        // NestJS 애플리케이션 생성
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule,
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: ':memory',
                    entities: [Quiz, QuizSet],
                    synchronize: true,
                }),
                QuizModule,
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        dataSource = app.get(DataSource);
        agent = request.agent(app.getHttpServer());

    });

    beforeEach(async () => {
        await dataSource.query('PRAGMA foreign_keys = OFF'); // 외래 키 비활성화
        const entities = dataSource.entityMetadatas;
        for (const entity of entities) {
            const repository = dataSource.getRepository(entity.name);
            await repository.query(`DELETE FROM ${entity.tableName}`);
        }
        await dataSource.query('PRAGMA foreign_keys = ON'); // 외래 키 활성화

        // 초기 데이터 삽입
        const quizSetRepository = dataSource.getRepository(QuizSet);
        const quizRepository = dataSource.getRepository(Quiz);

        // QuizSet 데이터 삽입
        quizSet = await quizSetRepository.save({
            id: 1,
            name: '테스트 퀴즈셋',
        });

        // Quiz 데이터 삽입
        quiz = await quizRepository.save({
            id: 1,
            question: '테스트 퀴즈 질문',
            answer: '테스트 정답',
            playTime: 5000,
            quizType: QUIZ_TYPE.SHORT_ANSWER,
            quizSet: {id: 1},
        });
    })


    afterAll(async () => {
        if (dataSource && dataSource.isInitialized) {
            await dataSource.destroy();
        }
        await app.close();
    });

    describe('createQuizSet', () => {
        it('퀴즈셋 정상적으로 저장', async () => {
            const dto = {
                name: "퀴즈셋 이름 테스트"
            } as CreateQuizSetRequestDto;

            const response = await agent.post(`/quiz`).send(dto).expect(201);

            expect(response.body).toEqual({
                id: expect.any(Number),
            });
        });
    })

    describe('createQuizzes', () => {
        it('새로운 퀴즈 추가 요청 성공', async () => {
            const quizSetId = 1;

            const quizData = [{
                question: '지브리는 뭘로 돈 벌게요?',
                answer: '토토로',
                playTime: 30000,
                quizType: 'SHORT_ANSWER',
            }] as CreateQuizRequestDto[];

            const response = await agent.post(`/quiz/${quizSetId}`).send(quizData).expect(201);
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
    })

    describe('getQuizzes', () => {
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

        it('퀴즈 리스트 반환 요청 - 존재하지 않는 QuizSetId로 요청 시 400 반환', async () => {
            const nonExistentQuizSetId = 10;
            const response = await agent.get(`/quiz/${nonExistentQuizSetId}`).expect(400);

            expect(response.body).toEqual({
                statusCode: 400,
                message: '해당 퀴즈셋을 찾을 수 없습니다.',
                error: 'Bad Request',
            });
        });
    })
    describe('updateQuiz', () => {
        it('퀴즈 정상적으로 수정', async () => {
            const quizId = quiz.id;
            const dto = {
                question: "질문 수정 테스트",
                answer: "대답 수정 테스트",
                playTime: 5000,
                quizType: QUIZ_TYPE.SHORT_ANSWER,
            } as UpdateQuizRequestDto;

            const response = await agent.patch(`/quiz/${quizId}`).send(dto).expect(200);
        });

        it('존재하지 않는 퀴즈 수정 요청 -> 400 에러', async () => {
                const quizId = 100;
                const dto = {
                    question: "질문 수정 테스트",
                    answer: "대답 수정 테스트",
                    playTime: 5000,
                    quizType: QUIZ_TYPE.SHORT_ANSWER,
                } as UpdateQuizRequestDto;

                const response = await agent.patch(`/quiz/${quizId}`).send(dto).expect(200);
        })
    })

    describe('deleteQuiz', () => {
        it('퀴즈 정상적으로 삭제', async () => {
            const quizId = quiz.id;

            const response = await agent.delete(`/quiz/${quizId}`).expect(200);

        });

        it('존재하지 않는 퀴즈 삭제 요청 -> 400 에러', async () => {
            const quizId = 100;

            const response = await agent.delete(`/quiz/${quizId}`).expect(400);
        });
    });
});
