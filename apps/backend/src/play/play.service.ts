import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { QuizZoneService } from '../quiz-zone/quiz-zone.service';
import { SubmittedQuiz } from '../quiz-zone/entities/submitted-quiz.entity';
import { QuizZone } from '../quiz-zone/entities/quiz-zone.entity';
import { QuizResultSummaryDto } from './dto/quiz-result-summary.dto';
import { CurrentQuizDto } from './dto/current-quiz.dto';
import { PLAYER_STATE, QUIZ_ZONE_STAGE } from '../common/constants';

@Injectable()
export class PlayService {
    constructor(private readonly quizZoneService: QuizZoneService) {}

    /**
     * 특정 퀴즈 존에서 현재 퀴즈에 대한 답변을 제출합니다.
     * @param quizZoneId - 퀴즈 존 ID
     * @param clientId - 플레이어 ID
     * @param submitQuiz - 제출된 퀴즈의 답변과 메타데이터
     * @throws {BadRequestException} 답변을 제출할 수 없는 경우 예외가 발생합니다.
     */
    async submit(quizZoneId: string, clientId: string, submitQuiz: SubmittedQuiz) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        quizZone.submitCount++;
        this.submitQuiz(quizZone, clientId, submitQuiz);
    }

    /**
     * 다음 퀴즈를 준비하고 타이밍과 퀴즈 데이터를 반환합니다.
     * @param quizZoneId - 퀴즈 존 ID
     * @returns 퀴즈 존에 설정된 인터벌 시간과 다음 퀴즈 데이터를 포함하는 객체
     * @throws {NotFoundException} 더 이상 진행할 퀴즈가 없을 경우 예외가 발생합니다.
     */
    async playNextQuiz(quizZoneId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { intervalTime } = quizZone;

        const nextQuiz = await this.nextQuiz(quizZoneId);

        quizZone.players.forEach((player) => {
            player.state = PLAYER_STATE.WAIT;
        });

        return {
            intervalTime,
            nextQuiz,
        };
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
            throw new NotFoundException('모든 퀴즈를 출제하였습니다.');
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

    /**
     * 퀴즈 시간이 초과될 경우 퀴즈에 대해 미제출 답변으로 제출합니다.
     * @param quizZoneId - 퀴즈 존 ID.
     */
    async quizTimeOut(quizZoneId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { players } = quizZone;
        players.forEach((player) => {
            if (player.state === 'PLAY') {
                this.submitQuiz(quizZone, player.id);
            }
        });
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

        if (player.state !== 'PLAY') {
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
     * @param clientId - 플레이어 ID
     * @returns 퀴즈 결과 요약 DTO를 포함한 Promise
     */
    async summary(quizZoneId: string, clientId: string): Promise<QuizResultSummaryDto> {
        const { players, quizzes } = await this.quizZoneService.findOne(quizZoneId);
        const player = players.get(clientId);
        return {
            score: player.score,
            submits: player.submits,
            quizzes,
        };
    }

    /**
     * 퀴즈 존의 상태를 지웁니다.
     * @param quizZoneId - 퀴즈 존 ID
     */
    async clearQuizZone(quizZoneId: string) {
        await this.quizZoneService.clearQuizZone(quizZoneId);
    }

    async findOthersInfo(quizZoneId: string, clientId: string) {
        return this.quizZoneService.findOthersInfo(quizZoneId, clientId);
    }

    async findClientInfo(quizZoneId: string, clientId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const player = quizZone.players.get(clientId);
        if (!player) {
            throw new NotFoundException();
        }
        return player;
    }

    async checkAllSubmitted(quizZoneId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        return quizZone.submitCount === quizZone.players.size;
    }

    async isHostPlayer(quizZoneId: string, clientId: string) {
        const { hostId } = await this.quizZoneService.findOne(quizZoneId);
        return hostId === clientId;
    }

    async validatePlayer(quizZoneId: string, clientId: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        if (!quizZone.players.has(clientId)) {
            throw new BadRequestException('플레이어 정보를 찾을 수 없습니다.');
        }
    }

    async checkQuizZoneStage(quizZoneId: string, stage: string) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        if (quizZone.stage !== stage) {
            throw new BadRequestException(`퀴즈 존의 상태가 ${stage}가 아닙니다.`);
        }
    }
    async checkPlayerState(quizZoneId: string, clientId: string, state: string) {
        const { players } = await this.quizZoneService.findOne(quizZoneId);
        if (players.get(clientId).state !== state) {
            throw new BadRequestException(`사용자의 상태가 ${state}가 아닙니다.`);
        }
    }
    async changeQuizZoneStage(quizZoneId: string, stage: QUIZ_ZONE_STAGE) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        quizZone.stage = stage;
    }
    async changePlayerState(quizZoneId: string, stage: QUIZ_ZONE_STAGE) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        quizZone.stage = stage;
    }
}
