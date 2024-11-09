import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import WebSocket from 'ws';
import { WsAdapter } from '@nestjs/platform-ws';
import { PlayModule } from '../src/play/play.module';

describe('PlayGateway (e2e)', () => {
    let app: INestApplication;
    let wsClient: WebSocket;
    let httpServer: any;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [PlayModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useWebSocketAdapter(new WsAdapter(app));
        await app.init();
    });

    beforeEach(async () => {
        wsClient = new WebSocket('ws://localhost:3000/play');
        await new Promise((resolve) => wsClient.on('open', resolve));
    });

    afterEach(async () => {
        if (wsClient) {
            wsClient.close();
        }
    });

    afterAll(async () => {
        await app.close();
    });

    describe('WebSocket Connection Test', () => {
        it('should connect successfully', () => {
            expect(wsClient.readyState).toBe(WebSocket.OPEN); // WebSocket.OPEN === 1 연결 성공되어 open 상태
        });

        it('should receive pong', async () => {
            wsClient.send(JSON.stringify({ event: 'createPlay' }));
            await new Promise<void>((resolve) => {
                wsClient.on('message', (data) => {
                    const message = JSON.parse(data.toString());
                    expect(message).toEqual({
                        event: 'pong'
                    });
                    resolve();
                });
            });
        });

        it('should create different async_id for each connection', async () => {
            // 여러 클라이언트 연결
            const client1 = new WebSocket('ws://localhost:3000/play');
            const client2 = new WebSocket('ws://localhost:3000/play');
            const client3 = new WebSocket('ws://localhost:3000/play');

            // 연결이 완료될 때까지 대기
            await Promise.all([
                new Promise(resolve => client1.on('open', resolve)),
                new Promise(resolve => client2.on('open', resolve)),
                new Promise(resolve => client3.on('open', resolve))
            ]);

            // async_id 확인
            const id1 = findWebSocketAsyncId(client1);
            const id2 = findWebSocketAsyncId(client2);
            const id3 = findWebSocketAsyncId(client3);
            console.log(id1, id2, id3);
            // 각 ID가 서로 다른지 확인
            expect(id1).not.toBe(id2);
            expect(id2).not.toBe(id3);
            expect(id1).not.toBe(id3);

            client1.close();
            client2.close();
            client3.close();
        });
    });


});
function findWebSocketAsyncId(socket: WebSocket) {
    const socketSymbols = Object.getOwnPropertySymbols(socket['_socket']);
    const actualSymbol = socketSymbols.find(s => s.description === 'async_id_symbol');
    return socket['_socket'][actualSymbol];
}
