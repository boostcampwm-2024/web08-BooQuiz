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
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';

export interface PlayInfo {
    quizZoneId: string;
    submitHandle?: NodeJS.Timeout;
}

@WebSocketGateway({ path: '/play' })
export class PlayGateway implements OnGatewayConnection {
    @WebSocketServer()
    server: WebSocket;

    constructor(
        @Inject('PlayInfoStorage')
        private readonly plays: Map<WebSocket, PlayInfo>,
        private readonly playService: PlayService,
    ) {
        this.server.on('nextQuiz', (client: WebSocket) => this.playNextQuiz(client));
        // @SubscribeMessage('summary')
        this.server.on('summary', (client: WebSocket) => this.summary(client));
    }

    async handleConnection(client: WebSocket, request: IncomingMessage) {
        const cookies = parse(request.headers.cookie);
        const sessionId = cookies['connect.sid'];
        this.plays.set(client, { quizZoneId: sessionId });
    }

    @SubscribeMessage('start')
    async start(@ConnectedSocket() client: WebSocket) {
        this.server.emit('nextQuiz', client);
        return {
            event: 'start',
            data: 'OK',
        };
    }

    private async playNextQuiz(client: WebSocket) {
        try {
            const playInfo = this.getPlayInfo(client);
            const { quizZoneId } = playInfo;

            const { intervalTime, nextQuiz } = await this.playService.playNextQuiz(quizZoneId);

            client.send(JSON.stringify({ event: 'nextQuiz', data: nextQuiz }));

            playInfo.submitHandle = setTimeout(() => {
                this.quizTimeOut(client);
            }, intervalTime + nextQuiz.playTime);
        } catch (error) {
            if (error instanceof NotFoundException) {
                client.send(JSON.stringify({ event: 'finish' }));
                this.server.emit('summary', client);
            }
        }
    }

    @SubscribeMessage('submit')
    async submit(
        @ConnectedSocket() client: WebSocket,
        @MessageBody('data') quizSubmit: QuizSubmitDto,
    ) {
        const playInfo = this.getPlayInfo(client);
        const { quizZoneId, submitHandle } = playInfo;

        clearTimeout(submitHandle);
        playInfo.submitHandle = undefined;

        await this.playService.submit(quizZoneId, { ...quizSubmit, receivedAt: Date.now() });

        this.server.emit('nextQuiz', client);

        return {
            event: 'submit',
            data: 'OK',
        };
    }

    getPlayInfo(client: WebSocket) {
        const playInfo = this.plays.get(client);

        if (playInfo === undefined) {
            throw new BadRequestException('사용자의 접속 정보를 찾을 수 없습니다.');
        }

        return playInfo;
    }

    private async quizTimeOut(socket: WebSocket) {
        const playInfo = this.getPlayInfo(socket);
        const { quizZoneId } = playInfo;

        playInfo.submitHandle = undefined;

        await this.playService.quizTimeOut(quizZoneId);

        socket.send(JSON.stringify({ event: 'quizTimeOut' }));
        this.server.emit('nextQuiz', socket);
    }

    private async summary(client: WebSocket) {
        const playInfo = this.getPlayInfo(client);
        const { quizZoneId } = playInfo;
        const summaryResult = await this.playService.summary(quizZoneId);
        await this.playService.clearQuizZone(quizZoneId);
        this.plays.delete(client);
        client.send(JSON.stringify({ event: 'summary', data: summaryResult }));
    }
}
