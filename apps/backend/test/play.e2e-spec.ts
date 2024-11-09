import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { PlayModule } from '../src/play/play.module';
import request from 'superwstest';
import cookieParser from 'cookie-parser';
import session from 'express-session';

describe('PlayGateway (e2e)', () => {
    let app: INestApplication;
    let agent: any;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [PlayModule],
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

        app.useWebSocketAdapter(new WsAdapter(app));
        await app.init();

        agent = request('http://localhost:3000');
    });

    afterAll(async () => {
        await app.close();
    });

    describe('WebSocket Connection Test', () => {
        it('should connect successfully', async () => {
            await agent.ws('/play').expectText('connected');
        });

        it('should receive pong', async () => {
            await agent
                .ws('/play')
                .set('Cookie', 'hihi')
                .expectText('connected')
                .sendJson({
                    event: 'createPlay',
                })
                .expectJson({
                    event: 'pong',
                })
                .close();
        });
    });
});
