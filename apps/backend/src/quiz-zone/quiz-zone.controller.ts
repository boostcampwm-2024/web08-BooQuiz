import { Controller, Get, Post, Body, Patch, Param, Delete, Session, HttpCode } from '@nestjs/common';
import { QuizZoneService } from './quiz-zone.service';
import { UpdateQuizZoneDto } from './dto/update-quiz-zone.dto';

@Controller('quiz-zone')
export class QuizZoneController {
  constructor(private readonly quizZoneService: QuizZoneService) {}

  @Post()
  @HttpCode(201)
  async create(@Session() session: Record<string, any>) {
    console.log('session', session);
    await this.quizZoneService.create(session.id);
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
