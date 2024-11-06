import { Injectable } from '@nestjs/common';
import { CreateQuizZoneDto } from './dto/create-quiz-zone.dto';
import { UpdateQuizZoneDto } from './dto/update-quiz-zone.dto';
import { QuizZoneRepositoryInterface } from './quiz-zone.repository.interface';
import { QuizZoneRepositoryMemory } from './quiz-zone.repository.memory';
import { Quiz } from './entities/quiz.entity';

export const quizzes: Quiz[] = [
    { index: 0, question: 'What is the capital of Korea?', answer: 'Seoul' },
    { index: 1, question: 'WsadfsafKorea?', answer: 'sadfsaf' },
    { index: 2, question: 'Wsdfaf?', answer: 'cvxvcx' },
];

export class QuizZoneService {
    constructor(private readonly quizZoneRepository: QuizZoneRepositoryMemory) {}

    create(sessionId: string) {
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
