import {
    ConnectedSocket,
    MessageBody,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { PlayService } from './play.service';
import { Server, WebSocket } from 'ws';
import { QuizSubmitDto } from './dto/quiz-submit.dto';
import { QuizJoinDto } from './dto/quiz-join.dto';
import { BadRequestException, Inject } from '@nestjs/common';
import { CLOSE_CODE, QUIZ_ZONE_STAGE } from '../common/constants';
import { SendEventMessage } from './entities/send-event.entity';
import { ClientInfo } from './entities/client-info.entity';
import { WebSocketWithSession } from '../core/SessionWsAdapter';
import { RuntimeException } from '@nestjs/core/errors/exceptions';

/**
 * 퀴즈 게임에 대한 WebSocket 연결을 관리하는 Gateway입니다.
 * 클라이언트가 퀴즈 진행, 제출, 타임아웃 및 결과 요약과 관련된 이벤트를 처리합니다.
 */
@WebSocketGateway({ path: '/play' })
export class PlayGateway implements OnGatewayInit {
    @WebSocketServer()
    server: Server;

    constructor(
        @Inject('PlayInfoStorage')
        private readonly plays: Map<String, NodeJS.Timeout>,
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

    private sendToClient(clientId: string, event: string, data?: any) {
        const { socket } = this.getClientInfo(clientId);
        socket.send(JSON.stringify({ event, data }));
    }

    /**
     * 클라이언트의 세션 ID를 이용하여 클라이언트 정보를 조회합니다.
     *
     * @param clientId - 클라이언트의 세션 ID
     */
    private getClientInfo(clientId: string): ClientInfo {
        const clientInfo = this.clients.get(clientId);

        if (!clientInfo) {
            throw new BadRequestException('사용자의 접속 정보를 찾을 수 없습니다.');
        }

        return clientInfo;
    }

    private async broadcast(clientIds: string[], event: string, data?: any) {
        clientIds.forEach((clientId) => {
            this.sendToClient(clientId, event, data);
        });
    }

    /**
     * 클라이언트가 퀴즈 방에 참여했다는 메세지를 방의 다른 참여자들에게 전송합니다.
     *
     * @param client - 클라이언트 소켓
     * @param quizJoinDto - 퀴즈 참여 정보(퀴즈 존 ID)
     */
    @SubscribeMessage('join')
    async join(
        @ConnectedSocket() client: WebSocketWithSession,
        @MessageBody() quizJoinDto: QuizJoinDto,
    ): Promise<SendEventMessage<ResponsePlayerDto[]>> {
        const sessionId = client.session.id;
        const { quizZoneId } = quizJoinDto;

        const { currentPlayer, players } = await this.playService.joinQuizZone(
            quizZoneId,
            sessionId,
        );
        const { id, nickname } = currentPlayer;

        this.clients.set(sessionId, { quizZoneId, socket: client });

        await this.broadcast(
            players.map((players) => players.id),
            'someone_join',
            { id, nickname },
        );

        return {
            event: 'join',
            data: players.map(({ id, nickname }) => ({
                id,
                nickname,
            })),
        };
    }

    /**
     * 퀴즈 게임을 시작하는 메시지를 클라이언트로 전송합니다.
     *
     * @param client - WebSocket 클라이언트
     */
    @SubscribeMessage('start')
    async start(@ConnectedSocket() client: WebSocketWithSession) {
        const clientId = client.session.id;
        const { quizZoneId } = this.getClientInfo(clientId);

        const players = await this.playService.playQuizZone(quizZoneId, clientId);
        await this.broadcast(
            players.map((player) => player.id),
            'start',
            'OK',
        );

        this.server.emit('nextQuiz', quizZoneId);
    }

    /**
     * 퀴즈 방을 나갔다는 메시지를 클라이언트로 전송합니다.
     *
     * - 방장이 나가면 퀴즈 존을 삭제하고 모든 플레이어에게 방장이 나갔다고 알립니다.
     * - 일반 플레이어가 나가면 퀴즈 존에서 나가고 다른 플레이어에게 나갔다고 알립니다.
     * @param client - WebSocket 클라이언트
     */
    @SubscribeMessage('leave')
    async leave(@ConnectedSocket() client: WebSocketWithSession) {
        const clientId = client.session.id;
        const { quizZoneId } = this.getClientInfo(clientId);

        const { isHost, playerIds } = await this.playService.leaveQuizZone(quizZoneId, clientId);

        if (isHost) {
            await this.broadcast(playerIds, 'close');
            playerIds.forEach((id) => this.clients.delete(id));
        } else {
            this.clients.delete(clientId);
            await this.broadcast(playerIds, 'someone_leave', clientId);
        }

        return { event: 'leave', data: 'OK' };
    }

    /**
     * 다음 퀴즈를 시작하고 클라이언트에 전달합니다.
     *
     * @param quizZoneId - WebSocket 클라이언트
     */
    private async playNextQuiz(quizZoneId: string) {
        let playerIds = [];

        try {
            const nextQuizInfo = await this.playService.playNextQuiz(quizZoneId);
            const { nextQuiz, intervalTime } = nextQuizInfo;

            playerIds = nextQuizInfo.playerIds;

            await this.broadcast(playerIds, 'nextQuiz', nextQuiz);

            this.plays.set(
                quizZoneId,
                setTimeout(() => {
                    this.quizTimeOut(quizZoneId);
                }, intervalTime + nextQuiz.playTime),
            );
        } catch (error) {
            if (error instanceof RuntimeException) {
                await this.broadcast(playerIds, 'finish');
                this.server.emit('summary', quizZoneId);
            } else {
                throw error;
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

        await this.playService.checkQuizZoneStage(quizZoneId, QUIZ_ZONE_STAGE.IN_PROGRESS);

        await this.playService.submit(quizZoneId, clientId, {
            ...quizSubmit,
            receivedAt: Date.now(),
        });

        const isAllSubmitted = await this.playService.checkAllSubmitted(quizZoneId);

        if (isAllSubmitted) {
            const submitHandle = this.plays.get(quizZoneId);
            clearTimeout(submitHandle);
            this.plays.set(quizZoneId, undefined);

            this.server.emit('nextQuiz', quizZoneId);
        }

        return {
            event: 'submit',
            data: 'OK',
        };
    }

    /**
     * 퀴즈 시간이 초과된 경우 호출되어, 타임아웃을 처리합니다.
     *
     * @param quizZoneId - WebSocket 클라이언트
     */
    private async quizTimeOut(quizZoneId: string) {
        this.plays.set(quizZoneId, undefined);

        await this.playService.quizTimeOut(quizZoneId);
        await this.broadcast(quizZoneId, 'quizTimeOut');

        this.server.emit('nextQuiz', quizZoneId);
    }

    /**
     * 퀴즈 진행이 끝나면 요약 결과를 퀴즈 존의 모든 플레이어에게 전송합니다.
     *
     * @param quizZoneId - WebSocket 클라이언트
     */
    private async summary(quizZoneId: string) {
        const playerIdList = await this.playService.getPlayerIdList(quizZoneId);

        await Promise.all(
            playerIdList.map(async (playerId) => {
                const { socket } = this.getClientInfo(playerId);
                const summaryResult = await this.playService.summary(quizZoneId, playerId);

                this.sendToClient(socket, 'summary', summaryResult);
                this.clients.delete(playerId);
                socket.close(CLOSE_CODE.NORMAL, '퀴즈가 종료되었습니다.');
            }),
        );

        this.plays.delete(quizZoneId);

        await this.playService.clearQuizZone(quizZoneId);
    }
}
