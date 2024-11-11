import { BadRequestException, Controller, HttpCode, Post, Session } from '@nestjs/common';
import { QuizZoneService } from './quiz-zone.service';

@Controller('quiz-zone')
export class QuizZoneController {
    constructor(private readonly quizZoneService: QuizZoneService) {}

    @Post()
    @HttpCode(201)
    async create(@Session() session: Record<string, any>) {
        const sessionId = session.id;

        if (sessionId === undefined) {
            throw new BadRequestException('세션 정보가 없습니다.');
        }

        await this.quizZoneService.create(sessionId);
    }
}
