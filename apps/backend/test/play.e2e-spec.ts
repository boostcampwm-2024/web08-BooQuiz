// import { Test } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// // import { io } from 'socket.io-client';
// import { PlayModule } from '../src/play/play.module';
// import { WebSocket } from 'ws';
//
// describe('소켓 테스트', () => {
//     let app: INestApplication;
//     let socket;
//     let client: WebSocket;
//
//     beforeEach(async () => {
//         const testingModule = await Test.createTestingModule({
//             imports: [PlayModule],
//         }).compile();
//
//         app = testingModule.createNestApplication();
//
//         await app.init();
//         await app.listen(3000);
//
//         await new Promise((resolve) => setTimeout(resolve, 200));
//
//         // socket = io('http://localhost:3000/play');
//     });
//
//     afterEach(async () => {
//         socket.disconnect();
//         await app.close();
//     });
//
//     it('connection 테스트', async () => {
//         console.log(socket);
//         socket.emit('createPlay', { name: 'New Game', playerCount: 4 });
//     });
// });

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import WebSocket from 'ws';
import { WsAdapter } from '@nestjs/platform-ws';
import { createServer } from 'http';
import { PlayModule } from '../src/play/play.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';

describe('PlayGateway (e2e)', () => {
    let app: INestApplication;
    let wsClient: WebSocket;
    let httpServer: any;

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

        httpServer = createServer(app.getHttpAdapter().getInstance());
        app.useWebSocketAdapter(new WsAdapter(httpServer));

        await app.init();
        await app.listen(3000);
    });

    beforeEach((done) => {
        wsClient = new WebSocket('ws://localhost:8080/play');

        wsClient.on('open', () => done());
        wsClient.on('error', (err) => done(err));
    });

    afterEach(async () => {
        if (wsClient) {
            wsClient.close();
        }
    });

    afterAll(async () => {
        await app.close();
    });

    it('should connect successfully', (done) => {
        expect(wsClient.readyState).toBe(WebSocket.OPEN);
        done();
    });
});
