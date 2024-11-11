import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { PlayService } from './play.service';
import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { parse } from 'cookie';
import { QuizSubmitDto } from './dto/quiz-submit.dto';

@WebSocketGateway({ path: '/play' })
export class PlayGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: WebSocket;

    constructor(private readonly playService: PlayService) {}

    async handleConnection(client: WebSocket, request: IncomingMessage) {
        const cookies = parse(request.headers.cookie);
        const sessionId = cookies['connect.sid'];

        const quizZone = await this.playService.join(sessionId, client);

        client.send(JSON.stringify(quizZone));
    }

    @SubscribeMessage('start')
    async start(@ConnectedSocket() client: WebSocket) {
        return {
            event: 'start',
            data: await this.playService.start(client),
        };
    }

    @SubscribeMessage('submit')
    async submit(
        @ConnectedSocket() client: WebSocket,
        @MessageBody('data') quizSubmit: QuizSubmitDto,
    ) {
        await this.playService.submit(client, { ...quizSubmit, receivedAt: Date.now() });
    }
}
