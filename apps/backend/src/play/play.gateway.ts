import {
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets';
import { PlayService } from './play.service';
import { CreatePlayDto } from './dto/create-play.dto';
import { WebSocket } from 'ws';
import { IncomingMessage } from 'http';

@WebSocketGateway(3000,{path:'/play'})
export class PlayGateway implements OnGatewayConnection {
    constructor(private readonly playService: PlayService) {}

    handleConnection(client: WebSocket, request: IncomingMessage) {
        // console.log(client);
        // console.log(request.headers);
        // console.log(request.headers.cookie);
    }

    @SubscribeMessage('createPlay')
    create(client:any,data: any) {
        // return this.playService.create(createPlayDto);
        return { event: 'pong'};
    }
}
