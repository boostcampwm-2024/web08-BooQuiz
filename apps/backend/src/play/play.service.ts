import {
    BadRequestException,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { QuizZoneService } from '../quiz-zone/quiz-zone.service';
import { SubmittedQuiz } from '../quiz-zone/entities/submitted-quiz.entity';
import { QuizZone } from '../quiz-zone/entities/quiz-zone.entity';
import { CurrentQuizDto } from './dto/current-quiz.dto';
import { PLAYER_STATE, QUIZ_ZONE_STAGE } from '../common/constants';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RuntimeException } from '@nestjs/core/errors/exceptions';
import { clearTimeout } from 'node:timers';
import { Player } from '../quiz-zone/entities/player.entity';
import { CurrentQuizResultDto } from './dto/current-quiz-result.dto';

@Injectable()
export class PlayService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly quizZoneService: QuizZoneService,
        @Inject('PlayInfoStorage') private readonly plays: Map<string, NodeJS.Timeout>,
    ) {}

    async joinQuizZone(quizZoneId: string, sessionId: string) {
        const { players } = await this.quizZoneService.findOne(quizZoneId);

        if (!players.has(sessionId)) {
            throw new NotFoundException('참여하지 않은 사용자입니다.');
        }

        return {
            currentPlayer: players.get(sessionId),
            players: [...players.values()],
        };
    }

    async startQuizZone(quizZoneId: string, clientId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { hostId, stage, players } = quizZone;

        if (hostId !== clientId) {
            throw new UnauthorizedException('방장만 퀴즈를 시작할 수 있습니다.');
        }

        if (stage !== QUIZ_ZONE_STAGE.LOBBY) {
            throw new BadRequestException('이미 시작된 퀴즈존입니다.');
        }

        await this.quizZoneService.updateQuizZone(quizZoneId, {
            ...quizZone,
            stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
        });

        return [...players.values()].map((player) => player.id);
    }

    /**
     * 다음 퀴즈를 준비하고 타이밍과 퀴즈 데이터를 반환합니다.
     * @param quizZoneId - 퀴즈 존 ID
     * @param timeoutHandle - 타임아웃이 발생하면 실행되어야할 콜백 함수
     * @returns 퀴즈 존에 설정된 인터벌 시간과 다음 퀴즈 데이터를 포함하는 객체
     * @throws {RuntimeException} 더 이상 진행할 퀴즈가 없을 경우 예외가 발생합니다.
     * @throws {NotFoundException} 퀴즈존 정보가 없을 경우 예외가 발생합니다..
     */
    async playNextQuiz(quizZoneId: string, timeoutHandle: Function) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { players, intervalTime } = quizZone;

        const currentQuizResult = this.getCurrentQuizResult(quizZone);

        const nextQuiz = await this.nextQuiz(quizZoneId);

        await this.quizZoneService.updateQuizZone(quizZoneId, {
            ...quizZone,
            players: new Map(
                [...players].map(([id, player]) => [id, { ...player, state: PLAYER_STATE.WAIT }]),
            ),
        });

        setTimeout(() => {
            this.quizZoneService.updateQuizZone(quizZoneId, {
                ...quizZone,
                players: new Map(
                    [...players].map(([id, player]) => [
                        id,
                        { ...player, state: PLAYER_STATE.PLAY },
                    ]),
                ),
            });
        }, intervalTime);

        this.setQuizZoneHandle(
            quizZoneId,
            () => {
                this.quizTimeOut(quizZoneId);
                timeoutHandle();
            },
            intervalTime + nextQuiz.playTime,
        );

        return {
            nextQuiz,
            playerIds: [...players.values()].map((player) => player.id),
            currentQuizResult,
        };
    }

    private getCurrentQuizResult(quizZone: QuizZone): CurrentQuizResultDto {
        const { players, currentQuizIndex } = quizZone;
        const currentQuizResult = {} as CurrentQuizResultDto;

        if (currentQuizIndex === -1) {
            currentQuizResult['answer'] = undefined;
            currentQuizResult['totalPlayerCount'] = 0;
            currentQuizResult['correctPlayerCount'] = 0;
        }

        if (currentQuizIndex >= 0) {
            const answer: string = quizZone.quizzes.at(currentQuizIndex).answer;
            currentQuizResult['answer'] = answer;
            currentQuizResult['totalPlayerCount'] = players.size;
            currentQuizResult['correctPlayerCount'] = [...players.values()].filter(
                (player) => player.submits[currentQuizIndex]?.answer === answer,
            ).length;
        }
        return currentQuizResult;
    }
    /**
     * 퀴즈 존에서 다음 퀴즈를 불러오고 퀴즈 타이밍을 업데이트합니다.
     * @param quizZoneId - 퀴즈 존 ID
     * @returns 출제할 퀴즈에 대한 정보를 포함하는 객체를 반환
     * @throws {NotFoundException} 모든 퀴즈가 이미 진행되었을 경우 예외가 발생합니다.
     */
    private async nextQuiz(quizZoneId: string): Promise<CurrentQuizDto> {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        quizZone.currentQuizIndex++;

        const { quizzes, currentQuizIndex, intervalTime } = quizZone;

        if (currentQuizIndex >= quizzes.length) {
            throw new RuntimeException('모든 퀴즈를 출제하였습니다.');
        }

        const nextQuiz = quizzes.at(currentQuizIndex);

        quizZone.currentQuizStartTime = Date.now() + intervalTime;
        quizZone.currentQuizDeadlineTime = quizZone.currentQuizStartTime + nextQuiz.playTime;

        return {
            stage: quizZone.stage,
            question: nextQuiz.question,
            currentIndex: quizZone.currentQuizIndex,
            playTime: nextQuiz.playTime,
            startTime: quizZone.currentQuizStartTime,
            deadlineTime: quizZone.currentQuizDeadlineTime,
        };
    }

    async finishQuizZone(quizZoneId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        quizZone.stage = QUIZ_ZONE_STAGE.RESULT;
        return [...quizZone.players.values()].map((player) => player.id);
    }

    /**
     * 퀴즈 시간이 초과될 경우 퀴즈에 대해 미제출 답변으로 제출합니다.
     * @param quizZoneId - 퀴즈 존 ID.
     */
    private async quizTimeOut(quizZoneId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { players } = quizZone;

        players.forEach((player) => {
            if (player.state === PLAYER_STATE.PLAY) {
                this.submitQuiz(quizZone, player.id);
            }
        });

        this.clearQuizZoneHandle(quizZoneId);

        return {
            playerIds: [...players.values()].map(({ id }) => id),
        };
    }

    /**
     * 특정 퀴즈 존에서 현재 퀴즈에 대한 답변을 제출합니다.
     * @param quizZoneId - 퀴즈 존 ID
     * @param clientId - 플레이어 ID
     * @param submitQuiz - 제출된 퀴즈의 답변과 메타데이터
     * @throws {BadRequestException} 답변을 제출할 수 없는 경우 예외가 발생합니다.
     */
    async submit(quizZoneId: string, clientId: string, submitQuiz: SubmittedQuiz) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { stage, players } = quizZone;

        if (stage !== QUIZ_ZONE_STAGE.IN_PROGRESS) {
            throw new BadRequestException('퀴즈를 제출할 수 없습니다.');
        }

        this.submitQuiz(quizZone, clientId, submitQuiz);

        const submittedPlayers = [...players.values()].filter(
            (player) => player.state === PLAYER_STATE.SUBMIT,
        );

        const fastestPlayerIds = this.getFastestPlayerIds(
            submittedPlayers,
            quizZone.currentQuizIndex,
        );

        const isLastSubmit = [...players.values()].every(
            ({ state }) => state === PLAYER_STATE.SUBMIT,
        );

        isLastSubmit && this.clearQuizZoneHandle(quizZoneId);

        return {
            isLastSubmit,
            fastestPlayerIds,
            submittedCount: submittedPlayers.length,
            totalPlayerCount: players.size,
            otherSubmittedPlayerIds: submittedPlayers
                .filter((player) => player.id !== clientId)
                .map(({ id }) => id),
        };
    }

    private getFastestPlayerIds(submittedPlayers: Player[], currentQuizIndex: number, count = 3) {
        return submittedPlayers
            .sort(
                (a, b) =>
                    a.submits[currentQuizIndex].submittedAt -
                    b.submits[currentQuizIndex].submittedAt,
            )
            .slice(0, count)
            .map(({ id }) => id);
    }

    /**
     * 제출된 퀴즈 답변을 처리합니다.
     * @param quizZone - 퀴즈 존 객체
     * @param clientId - 플레이어 ID
     * @param submitQuiz - (선택적) 제출된 퀴즈 데이터(사용하지 않을 경우 미제출 답변)
     * @throws {BadRequestException} 플레이어가 답변을 제출할 수 없는 상태일 경우 예외가 발생합니다.
     */
    private submitQuiz(quizZone: QuizZone, clientId: string, submitQuiz?: SubmittedQuiz) {
        const { players, currentQuizIndex, quizzes, currentQuizDeadlineTime } = quizZone;
        const quiz = quizzes.at(currentQuizIndex);
        const player = players.get(clientId);

        if (player.state !== PLAYER_STATE.PLAY) {
            throw new BadRequestException('정답을 제출할 수 없습니다.');
        }

        const now = Date.now();

        const submittedQuiz = {
            index: currentQuizIndex,
            answer: undefined,
            submittedAt: now,
            receivedAt: now,
            ...submitQuiz,
        };

        player.submits.push(submittedQuiz);

        if (
            quiz.answer === submittedQuiz.answer &&
            submittedQuiz.submittedAt <= currentQuizDeadlineTime
        ) {
            player.score++;
        }

        player.state = PLAYER_STATE.SUBMIT;
    }

    /**
     * 퀴즈 존에서 사용자의 퀴즈 진행 요약 결과를 제공합니다.
     * @param quizZoneId - 퀴즈 존 ID
     * @returns 퀴즈 결과 요약 DTO를 포함한 Promise
     */
    async summaryQuizZone(quizZoneId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { players, quizzes } = quizZone;

        this.clearQuizZoneHandle(quizZoneId);

        const ranks = this.getRanking(players);

        return [...players.values()].map(({ id, score, submits }) => ({
            id,
            score,
            submits,
            quizzes,
            ranks,
        }));
    }

    public clearQuizZone(quizZoneId: string) {
        this.quizZoneService.clearQuizZone(quizZoneId);
    }

    private getRanking(players: Map<string, Player>) {
        const sortedPlayers = [...players.values()].sort((a, b) => b.score - a.score);
        let currentRank = 1;
        let currentScore = sortedPlayers[0]?.score;
        let sameRankCount = -1; // 첫 번째 플레이어를 위해 -1로 시작

        return sortedPlayers.map((player) => {
            if (player.score < currentScore) {
                currentRank = currentRank + sameRankCount + 1;
                currentScore = player.score;
                sameRankCount = 0;
            } else {
                sameRankCount++;
            }

            return {
                id: player.id,
                nickname: player.nickname,
                score: player.score,
                ranking: currentRank,
            };
        });
    }

    async leaveQuizZone(quizZoneId: string, clientId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { stage, hostId, players } = quizZone;

        const isHost = hostId === clientId;

        if (stage !== QUIZ_ZONE_STAGE.LOBBY) {
            throw new BadRequestException('게임이 진행중입니다.');
        }

        if (isHost) {
            await this.quizZoneService.clearQuizZone(quizZoneId);
        } else {
            players.delete(clientId);
        }

        return {
            isHost,
            playerIds: [...players.values()].map((player) => player.id),
        };
    }

    async chatQuizZone(clientId: string, quizZoneId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { players } = quizZone;

        if (players.get(clientId).state === PLAYER_STATE.PLAY) {
            throw new BadRequestException('채팅을 제출한 플레이어 상태가 PLAY입니다.');
        }

        return [...players.values()]
            .filter((player) => player.state !== PLAYER_STATE.PLAY)
            .map((player) => player.id);
    }

    private setQuizZoneHandle(quizZoneId: string, handle: Function, time: number) {
        this.plays.set(
            quizZoneId,
            setTimeout(() => handle(), time),
        );
    }

    private clearQuizZoneHandle(quizZoneId: string) {
        const submitHandle = this.plays.get(quizZoneId);

        clearTimeout(submitHandle);
        this.plays.set(quizZoneId, undefined);
    }

    async changeNickname(quizZoneId: string, clientId: string, changedNickname: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { players } = quizZone;

        if (!players.has(clientId)) {
            throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
        }

        const player = players.get(clientId);

        if (player.state !== PLAYER_STATE.WAIT || quizZone.stage !== QUIZ_ZONE_STAGE.LOBBY) {
            throw new BadRequestException('현재 닉네임을 변경할 수 없습니다.');
        }

        player.nickname = changedNickname;

        return {
            playerIds: [...players.values()].map((player) => player.id),
        };
    }
}
