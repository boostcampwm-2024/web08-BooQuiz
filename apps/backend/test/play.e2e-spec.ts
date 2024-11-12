import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';
import { PlayModule } from '../src/play/play.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { Server } from 'http';
import wsrequest from 'superwstest';

describe('PlayGateway (e2e)', () => {
    let app: INestApplication;
    let server: Server;
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

        server = app.getHttpServer();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach((done) => {
        server.listen(0, 'localhost', done);
    });

    afterEach((done) => {
        server.close(done);
    });

    describe('WebSocket Connection Test', () => {
        it('should connect successfully', async () => {
            // await wsrequest(server).post('/quiz-zone').expect(201);
            await wsrequest(server).ws('/play').set('Cookie', 'sid=12345');
        });

        it('should receive pong', async () => {
            await wsrequest(server)
                .ws('/play')
                .set('Cookie', 'sid=12345')
                .expectJson({})
                // .expectText('connected')
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
