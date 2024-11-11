import { OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { PlayService } from './play.service';
import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { QuizZoneService } from '../quiz-zone/quiz-zone.service';
import { parse } from 'cookie';

@WebSocketGateway({ path: '/play' })
export class PlayGateway implements OnGatewayConnection {
    constructor(
        private readonly playService: PlayService,
        private readonly quizZoneService: QuizZoneService,
    ) {}

    handleConnection(client: WebSocket, request: IncomingMessage) {
        const cookies = parse(request.headers.cookie);
        const sessionId = cookies['connect.sid'];
        const quizZone = this.quizZoneService.findOne(sessionId);
        client.send(JSON.stringify(quizZone));
    }

    @SubscribeMessage('createPlay')
    create(client: any, data: any) {
        // return this.playService.create(createPlayDto);
        return { event: 'pong' };
    }
}
