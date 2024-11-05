import { Injectable } from '@nestjs/common';
import { CreateQuizZoneDto } from './dto/create-quiz-zone.dto';
import { UpdateQuizZoneDto } from './dto/update-quiz-zone.dto';

@Injectable()
export class QuizZoneService {
  create(createQuizZoneDto: CreateQuizZoneDto) {
    return 'This action adds a new quizZone';
  }

  findAll() {
    return `This action returns all quizZone`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quizZone`;
  }

  update(id: number, updateQuizZoneDto: UpdateQuizZoneDto) {
    return `This action updates a #${id} quizZone`;
  }

  remove(id: number) {
    return `This action removes a #${id} quizZone`;
  }
}
