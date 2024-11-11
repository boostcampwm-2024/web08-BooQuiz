import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { WebSocket } from 'ws';
import { QuizZoneService } from '../quiz-zone/quiz-zone.service';
import { SubmittedQuiz } from '../quiz-zone/entities/submitted-quiz.entity';

@Injectable()
export class PlayService {
    private readonly plays: Map<WebSocket, { quizZoneId: string; submitHandle?: NodeJS.Timeout }> =
        new Map();

    constructor(private readonly quizZoneService: QuizZoneService) {}

    async join(quizZoneId: string, client: WebSocket) {
        const quizZone = await this.quizZoneService.findOne(quizZoneId);

        if (quizZone.player.id !== quizZoneId) {
            throw new UnauthorizedException('개설 정보가 일치하지 않습니다.');
        }

        this.plays.set(client, { quizZoneId });

        return quizZone;
    }

    async start(client: WebSocket) {
        // 퀴즈 시작 = 사용자 정보 조회, 퀴즈존 정보 조회, 퀴즈존 상태 변경, 문제 풀이 타이머 작동, 문제 풀이 상태 반환
        // 퀴즈존 상태 변경 > 현재 퀴즈 정보
        //
        const playInfo = this.getPlayInfo(client);
        const { quizZoneId } = playInfo;
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const {
            stage,
            quizzes,
            currentQuizIndex,
            currentQuizStartTime,
            currentQuizDeadlineTime,
            intervalTime,
        } = quizZone;
        const currentQuiz = quizzes.at(currentQuizIndex);
        const { playTime } = currentQuiz;

        quizZone.stage = 'WAITING';
        quizZone.currentQuizStartTime = Date.now() + intervalTime;
        quizZone.currentQuizDeadlineTime = quizZone.currentQuizStartTime + playTime;

        playInfo.submitHandle = setTimeout(() => {
            client.send(JSON.stringify({ event: 'timeout' }));
            quizZone.player.submits.push(undefined);
        }, currentQuiz.playTime + intervalTime);

        return {
            stage,
            question: currentQuiz.question,
            currentIndex: currentQuizIndex,
            startTime: currentQuizStartTime,
            deadlineTime: currentQuizDeadlineTime,
        };
    }

    async submit(client: WebSocket, submitQuiz: SubmittedQuiz) {
        const { quizZoneId, submitHandle } = this.getPlayInfo(client);
        const quizZone = await this.quizZoneService.findOne(quizZoneId);
        const { player, quizzes, currentQuizIndex, intervalTime } = quizZone;

        // 제출 처리 = 제출 정보 저장, 채점, 상태 변경, 다음 문제 출제
        clearTimeout(submitHandle);
        player.submits.push(submitQuiz);

        const currentQuiz = quizzes.at(currentQuizIndex);

        if (currentQuiz.answer === submitQuiz.answer) {
            player.score++;
        }

        quizZone.currentQuizIndex++;

        const nextQuiz = quizzes.at(quizZone.currentQuizIndex);

        quizZone.stage = 'WAITING';
        quizZone.currentQuizStartTime = Date.now() + intervalTime;
        quizZone.currentQuizDeadlineTime = quizZone.currentQuizStartTime + nextQuiz.playTime;

        return {
            stage: quizZone.stage,
            question: nextQuiz.question,
            currentIndex: currentQuizIndex,
            startTime: quizZone.currentQuizStartTime,
            deadlineTime: quizZone.currentQuizDeadlineTime,
        };
    }

    private getPlayInfo(client: WebSocket) {
        const playInfo = this.plays.get(client);

        if (playInfo === undefined) {
            throw new BadRequestException('사용자의 접속 정보를 찾을 수 없습니다.');
        }

        return playInfo;
    }
}
