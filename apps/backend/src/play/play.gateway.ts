import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { PlayService } from './play.service';
import { Server, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { parse } from 'cookie';
import { QuizSubmitDto } from './dto/quiz-submit.dto';
import { QuizJoinDto } from './dto/quiz-join.dto';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { PLAYER_STATE, QUIZ_ZONE_STAGE } from '../common/constants';

//TODO 여러명일때 service 수정해야함.

/**
 * PlayInfo 인터페이스는 클라이언트의 퀴즈 진행 상태를 나타냅니다.
 */
export interface PlayInfo {
    quizZoneClients: Map<string, WebSocket>;
    hostClient: WebSocket;
    submitHandle?: NodeJS.Timeout;
}

/**
 * 퀴즈 클라이언트의 정보를 나타냅니다.
 *
 * @property quizZoneId - 클라이언트가 참여한 퀴즈존 ID
 * @property socket - 클라이언트의 WebSocket 연결
 */
export interface ClientInfo {
    quizZoneId: string;
    socket: WebSocket;
}

/**
 * 웹소켓 서버가 사용자에게 응답할 메시지 형식을 정의합니다.
 */
interface SendEventMessage<T> {
    event: string;
    data: T;
}

const CLOSE_NORMAL = 1000;
/**
 * 퀴즈 게임에 대한 WebSocket 연결을 관리하는 Gateway입니다.
 * 클라이언트가 퀴즈 진행, 제출, 타임아웃 및 결과 요약과 관련된 이벤트를 처리합니다.
 */
@WebSocketGateway({ path: '/play' })
export class PlayGateway implements OnGatewayConnection, OnGatewayInit {
    @WebSocketServer()
    server: Server;

    constructor(
        @Inject('PlayInfoStorage')
        private readonly plays: Map<String, PlayInfo>,
        @Inject('ClientInfoStorage')
        private readonly clients: Map<String, ClientInfo>,
        private readonly playService: PlayService,
    ) {}

    /**
     * WebSocket 서버 초기화 시, 퀴즈 진행 및 요약 이벤트를 처리하는 핸들러를 설정합니다.
     *
     * @param server - WebSocket 서버 인스턴스
     */
    afterInit(server: Server) {
        server.on('nextQuiz', (quizZoneId: string) => this.playNextQuiz(quizZoneId));
        server.on('summary', (quizZoneId: string) => this.summary(quizZoneId));
    }

    /**
     * WebSocket 연결이 성공적으로 이루어졌을 때 호출됩니다.
     * 클라이언트의 세션 정보를 파싱하여 플레이 정보를 설정합니다.
     *
     * @param client - WebSocket 클라이언트
     * @param request - HTTP 요청 객체
     */
    async handleConnection(client: WebSocket, request: IncomingMessage) {
        const cookies = parse(request.headers.cookie);
        client['sessionId'] = cookies['connect.sid'].split('.').at(0).slice(2);
    }

    // async handleDisconnect(client: WebSocket) {
    //     client.terminate();
    // }

    // 방장 유무에 따라 PlayInfo를 반환합니다.
    private getJoinPlayInfo(client: WebSocket, quizZoneId: string): PlayInfo {
        if (!this.plays.has(quizZoneId)) {
            return {
                quizZoneClients: new Map(),
                hostClient: client,
            };
        } else {
            return this.plays.get(quizZoneId);
        }
    }

    private sendToClient(client: WebSocket, event: string, data?: any) {
        client.send(JSON.stringify({ event, data }));
    }

    private broadcast(quizZoneId: string, event: string, data?: any) {
        const { quizZoneClients } = this.getPlayInfo(quizZoneId);

        quizZoneClients.forEach((client) => {
            this.sendToClient(client, event, data);
        });
    }

    @SubscribeMessage('join')
    async join(
        @ConnectedSocket() client: WebSocket,
        @MessageBody() quizJoinDto: QuizJoinDto,
    ): Promise<SendEventMessage<Object[]>> {
        const sessionId = client['sessionId'];
        const { quizZoneId } = quizJoinDto;

        await this.playService.validatePlayer(quizZoneId, sessionId);
        
        this.clients.set(sessionId, { quizZoneId, socket: client });

        const playInfo = this.getJoinPlayInfo(client, quizZoneId);
        // 참여자들에게 사용자가 들어왔다고 알림
        const { id, nickname } = await this.playService.findClientInfo(quizZoneId, sessionId);

        this.broadcast(quizZoneId, 'someone_join', { id, nickname });

        const usersInfo = await this.playService.findOthersInfo(quizZoneId, sessionId);

        playInfo.quizZoneClients.set(sessionId, client);

        return {
            event: 'join',
            data: usersInfo,
        };
    }

    /**
     * 퀴즈 게임을 시작하는 메시지를 클라이언트로 전송합니다.
     *
     * @param client - WebSocket 클라이언트
     */
    @SubscribeMessage('start')
    async start(@ConnectedSocket() client: WebSocket) {
        const clientId = client['sessionId'];
        const { quizZoneId } = this.getClientInfo(clientId);

        const isHost = await this.playService.isHostPlayer(quizZoneId, clientId);

        if (!isHost) {
            return;
        }

        await this.playService.checkQuizZoneStage(quizZoneId, QUIZ_ZONE_STAGE.LOBBY);

        this.broadcast(quizZoneId, 'start', 'OK');

        await this.playService.changeQuizZoneStage(quizZoneId, QUIZ_ZONE_STAGE.IN_PROGRESS);

        this.server.emit('nextQuiz', quizZoneId);
    }

    /**
     * 다음 퀴즈를 시작하고 클라이언트에 전달합니다.
     *
     * @param quizZoneId - WebSocket 클라이언트
     */
    private async playNextQuiz(quizZoneId: string) {
        try {
            const playInfo = this.getPlayInfo(quizZoneId);
            const { intervalTime, nextQuiz } = await this.playService.playNextQuiz(quizZoneId);

            this.broadcast(quizZoneId, 'nextQuiz', nextQuiz);

            setTimeout(() => {
                this.playService.changeAllPlayersState(quizZoneId, PLAYER_STATE.PLAY);
            }, intervalTime);

            playInfo.submitHandle = setTimeout(() => {
                this.quizTimeOut(quizZoneId);
            }, intervalTime + nextQuiz.playTime);
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.broadcast(quizZoneId, 'finish');
                this.server.emit('summary', quizZoneId);
            }
        }
    }

    /**
     * 클라이언트가 퀴즈 답안을 제출한 경우 호출됩니다.
     *
     * @param client - WebSocket 클라이언트
     * @param quizSubmit - 퀴즈 제출 데이터
     * @returns {Promise<SendEventMessage<string>>} 제출 완료 메시지
     */
    @SubscribeMessage('submit')
    async submit(
        @ConnectedSocket() client: WebSocket,
        @MessageBody() quizSubmit: QuizSubmitDto,
    ): Promise<SendEventMessage<string>> {
        const clientId = client['sessionId'];
        const { quizZoneId } = this.getClientInfo(clientId);
        const playInfo = this.getPlayInfo(quizZoneId);
        await this.playService.checkQuizZoneStage(quizZoneId, QUIZ_ZONE_STAGE.IN_PROGRESS);
        // 개인이 제출하는 경우
        await this.playService.submit(quizZoneId, clientId, {
            ...quizSubmit,
            receivedAt: Date.now(),
        });

        const isAllSubmitted = await this.playService.checkAllSubmitted(quizZoneId);

        if (isAllSubmitted) {
            clearTimeout(playInfo.submitHandle);
            playInfo.submitHandle = undefined;
            this.server.emit('nextQuiz', quizZoneId);
        }

        return {
            event: 'submit',
            data: 'OK',
        };
    }

    getPlayInfo(quizZoneId: string): PlayInfo {
        const playInfo = this.plays.get(quizZoneId);

        if (playInfo === undefined) {
            throw new BadRequestException('사용자의 접속 정보를 찾을 수 없습니다.');
        }

        return playInfo;
    }
    getClientInfo(clientId: string): ClientInfo {
        const clientInfo = this.clients.get(clientId);

        if (clientInfo === undefined) {
            throw new BadRequestException('사용자의 접속 정보를 찾을 수 없습니다.');
        }

        return clientInfo;
    }

    /**
     * 퀴즈 시간이 초과된 경우 호출되어, 타임아웃을 처리합니다.
     *
     * @param quizZoneId - WebSocket 클라이언트
     */
    private async quizTimeOut(quizZoneId: string) {
        const playInfo = this.getPlayInfo(quizZoneId);

        playInfo.submitHandle = undefined;

        await this.playService.quizTimeOut(quizZoneId); //TODO: 퀴즈 타임아웃시 못 제출한 사람 제출 처리하는 부분

        this.broadcast(quizZoneId, 'quizTimeOut');

        this.server.emit('nextQuiz', quizZoneId);
    }

    /**
     * 퀴즈 진행이 끝나면 요약 결과를 클라이언트에 전송합니다.
     *
     * @param quizZoneId - WebSocket 클라이언트
     */
    private async summary(quizZoneId: string) {
        const playInfo = this.getPlayInfo(quizZoneId);

        await Promise.all(
            Array.from(playInfo.quizZoneClients).map(async ([clientId, websocket]) => {
                const summaryResult = await this.playService.summary(quizZoneId, clientId);
                this.sendToClient(websocket, 'summary', summaryResult);
                this.clients.delete(clientId);
                websocket.close(CLOSE_NORMAL, '퀴즈가 종료되었습니다.');
            }),
        );

        this.plays.delete(quizZoneId);

        await this.playService.clearQuizZone(quizZoneId);
    }
}
