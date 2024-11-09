import { OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { PlayService } from './play.service';
import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';

@WebSocketGateway(3000, { path: '/play' })
export class PlayGateway implements OnGatewayConnection {
    constructor(private readonly playService: PlayService) {}

    handleConnection(client: WebSocket, request: IncomingMessage) {
        client.send('connected');
    }

    @SubscribeMessage('createPlay')
    create(client: any, data: any) {
        // return this.playService.create(createPlayDto);
        return { event: 'pong' };
    }
}
