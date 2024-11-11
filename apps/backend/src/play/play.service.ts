import { Injectable, UnauthorizedException } from '@nestjs/common';
import { WebSocket } from 'ws';
import { QuizZoneService } from '../quiz-zone/quiz-zone.service';

@Injectable()
export class PlayService {
    private readonly plays: Map<string, WebSocket> = new Map();

    constructor(private readonly quizZoneService: QuizZoneService) {}

    async join(sessionId: string, client: WebSocket) {
        const quizZone = await this.quizZoneService.findOne(sessionId);

        if (quizZone.player.id !== sessionId) {
            throw new UnauthorizedException('개설 정보가 일치하지 않습니다.');
        }

        this.plays.set(sessionId, client);

        return quizZone;
    }
}
