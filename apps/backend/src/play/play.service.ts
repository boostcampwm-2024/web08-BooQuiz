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

        const { players, host } = await this.quizZoneService.findOne(quizZoneId);

        if (!players.has(sessionId) && host.id !== sessionId) {
            throw new NotFoundException('참여하지 않은 사용자입니다.');
        }

        if (host.id === sessionId) {
            return {
                currentPlayer: host,
                players: [...players.values(), host]
            }
        }

        return {
            currentPlayer: players.get(sessionId),
            players: [...players.values(), host],
        };
    }

    async startQuizZone(quizZoneId: string, clientId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { host, stage, players } = quizZone;

        if (host.id !== clientId) {
            throw new UnauthorizedException('방장만 퀴즈를 시작할 수 있습니다.');
        }

        if (stage !== QUIZ_ZONE_STAGE.LOBBY) {
            throw new BadRequestException('이미 시작된 퀴즈존입니다.');
        }

        await this.quizZoneService.updateQuizZone(quizZoneId, {
            ...quizZone,
            stage: QUIZ_ZONE_STAGE.IN_PROGRESS,
        });

        return [...players.values(), host].map((player) => player.id);
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
        const { players, intervalTime, host } = quizZone;

        const currentQuizResult = this.getCurrentQuizResult(quizZone);
        host.state = PLAYER_STATE.PLAY;
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
            playerIds: [...players.values(), host].map((player) => player.id),
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
        } else if (currentQuizIndex >= 0) {
            const answer: string = quizZone.quizzes.at(currentQuizIndex).answer.replace(/\s/g, '');
            currentQuizResult['answer'] = answer;
            currentQuizResult['totalPlayerCount'] = players.size;
            currentQuizResult['correctPlayerCount'] = [...players.values()].filter(
                (player) => player.submits[currentQuizIndex]?.answer.replace(/\s/g, '') === answer,
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
        const {players, host} = quizZone;
        return [...players.values(), host].map((player) => player.id);
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
     * @param submittedQuiz - 제출된 퀴즈의 답변과 메타데이터
     * @throws {BadRequestException} 답변을 제출할 수 없는 경우 예외가 발생합니다.
     */
    async submit(quizZoneId: string, clientId: string, submittedQuiz: SubmittedQuiz) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { stage, players, host } = quizZone;

        if (stage !== QUIZ_ZONE_STAGE.IN_PROGRESS) {
            throw new BadRequestException('퀴즈를 제출할 수 없습니다.');
        }

        const submittedCount = [...players.values()].filter(
            (player) => player.state === PLAYER_STATE.SUBMIT,
        ).length;

        submittedQuiz.submitRank = submittedCount + 1;

        this.submitQuiz(quizZone, clientId, submittedQuiz);

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
            otherSubmittedPlayerIds: [...submittedPlayers
                .filter((player) => player.id !== clientId)
                .map(({ id }) => id), host.id]
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
        const { players, currentQuizIndex, quizzes, currentQuizDeadlineTime, host } = quizZone;

        if(host.id === clientId) {
            return;
        }

        const quiz = quizzes.at(currentQuizIndex);
        const player = players.get(clientId);



        if (player.state !== PLAYER_STATE.PLAY) {
            throw new BadRequestException('정답을 제출할 수 없습니다.');
        }

        const now = Date.now();

        const submittedQuiz = {
            index: currentQuizIndex,
            answer: '',
            submittedAt: now,
            receivedAt: now,
            submitRank: players.size,
            ...submitQuiz,
        };

        player.submits.push(submittedQuiz);

        if (
            quiz.answer.replace(/\s/g, '') === submittedQuiz.answer.replace(/\s/g, '') &&
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
        const { players, quizzes, host} = quizZone;

        this.clearQuizZoneHandle(quizZoneId);

        await this.quizZoneService.clearQuizZone(quizZoneId);
        const ranks = this.getRanking(
            players,
            quizzes.map((quiz) => quiz.answer),
        );

        const summaries = [...players.values()].map(({ id, score, submits }) => ({
            id,
            score,
            submits,
            quizzes,
            ranks,
        }));

        return { summaries, host };
    }

    private calculateQuizRanks(
        players: Map<string, Player>,
        quizAnswers: string[],
    ): Map<number, string[]> {
        const quizRanks = new Map<number, string[]>();
        quizAnswers.forEach((answer, quizIndex) => {
            const sortedCorrectPlayerIds = [...players.values()]
                .filter((player) => player.submits[quizIndex]?.answer === answer)
                .sort((a, b) => a.submits[quizIndex].submitRank - b.submits[quizIndex].submitRank)
                .map((player) => player.id);

            quizRanks.set(quizIndex, sortedCorrectPlayerIds);
        });

        return quizRanks;
    }
    private getPlayersCorrectRankCount(
        players: Map<string, Player>,
        quizRanks: Map<number, string[]>,
    ) {
        return new Map(
            [...players.keys()].map((playerId) => {
                const rankCounts = new Map<number, number>();

                quizRanks.forEach((correctPlayers) => {
                    const rank = correctPlayers.indexOf(playerId) + 1;
                    if (rank > 0) {
                        rankCounts.set(rank, (rankCounts.get(rank) || 0) + 1);
                    }
                });

                return [playerId, rankCounts];
            }),
        );
    }

    private compareRankCounts(
        playerARankCount: Map<number, number>,
        playerBRankCount: Map<number, number>,
    ): number {
        const maxRank = Math.max(...[...playerARankCount.keys()], ...[...playerBRankCount.keys()]);

        for (let rank = 1; rank <= maxRank; rank++) {
            const aCount = playerARankCount.get(rank) || 0;
            const bCount = playerBRankCount.get(rank) || 0;
            if (aCount !== bCount) {
                return bCount - aCount;
            }
        }
        return 0;
    }

    private compareRanks(
        currentPlayer: Player,
        prevPlayer: Player,
        currentRankCount: Map<number, number>,
        prevRankCount: Map<number, number>,
    ): boolean {
        if (currentPlayer.score !== prevPlayer.score) {
            return true;
        }
        return this.compareRankCounts(currentRankCount, prevRankCount) !== 0;
    }

    private getRanking(players: Map<string, Player>, quizAnswers: string[]) {
        const quizRanks = this.calculateQuizRanks(players, quizAnswers);

        const playersCorrectRankCount = this.getPlayersCorrectRankCount(players, quizRanks);

        const sortedPlayers = [...players.values()].sort((playerA, playerB) => {
            if (playerB.score !== playerA.score) {
                return playerB.score - playerA.score;
            }

            return this.compareRankCounts(
                playersCorrectRankCount.get(playerA.id),
                playersCorrectRankCount.get(playerB.id),
            );
        });

        let currentRank = 1;
        let sameRankCount = 0;

        return sortedPlayers.map((player, index) => {
            if (index > 0) {
                const prevPlayer = sortedPlayers[index - 1];
                if (
                    this.compareRanks(
                        player,
                        prevPlayer,
                        playersCorrectRankCount.get(player.id),
                        playersCorrectRankCount.get(prevPlayer.id),
                    )
                ) {
                    currentRank += sameRankCount + 1;
                    sameRankCount = 0;
                } else {
                    sameRankCount++;
                }
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
        const { stage, host, players } = quizZone;

        const isHost = host.id === clientId;

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
            playerIds: [...players.values(), host].map((player) => player.id),
        };
    }

    async chatQuizZone(clientId: string, quizZoneId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { players, host } = quizZone;

        if (host.id !== clientId && players.get(clientId)?.state === PLAYER_STATE.PLAY) {
            throw new BadRequestException('채팅을 제출한 플레이어 상태가 PLAY입니다.');
        }

        return [...[...players.values()]
            .filter((player) => player.state !== PLAYER_STATE.PLAY)
            .map((player) => player.id), host.id];
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
        const { players, host } = quizZone;

        if (host.id !== clientId && !players.has(clientId)) {
            throw new NotFoundException('사용자 정보를 찾을 수 없습니다.');
        }

        const player = players.get(clientId) || host;

        if (player.state !== PLAYER_STATE.WAIT || quizZone.stage !== QUIZ_ZONE_STAGE.LOBBY) {
            throw new BadRequestException('현재 닉네임을 변경할 수 없습니다.');
        }

        player.nickname = changedNickname;

        return {
            playerIds: [host, ...players.values()].map((player) => player.id),
        };
    }

    async notice(clientId: string, quizZoneId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { players, host } = quizZone;
        const isHost = true;

        if(host.id !== clientId) {
            throw new BadRequestException();
        }

        const playerIds = [...[...players.values()]
            .filter((player) => player.state !== PLAYER_STATE.PLAY)
            .map((player) => player.id), host.id];

        return {
            isHost, playerIds,
        }

    }
}
