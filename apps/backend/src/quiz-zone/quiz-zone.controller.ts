import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Session,
} from '@nestjs/common';
import { QuizZoneService } from './quiz-zone.service';
import { UpdateQuizZoneDto } from './dto/update-quiz-zone.dto';

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

    @Get()
    findAll() {
        return this.quizZoneService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.quizZoneService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateQuizZoneDto: UpdateQuizZoneDto) {
        return this.quizZoneService.update(+id, updateQuizZoneDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.quizZoneService.remove(+id);
    }
}
