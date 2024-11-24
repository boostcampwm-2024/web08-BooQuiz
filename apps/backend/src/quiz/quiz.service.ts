import { Body, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Quiz } from './quiz.entitiy';
import { Repository } from 'typeorm';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { CreateQuizSetDto } from './dto/create-quiz-set.dto';
import { QuizSet } from './quiz-set.entity';
import { QUIZ_TYPE } from '../common/constants';
import { QuizRepository } from './quiz.repository';
import { QuizSetRepository } from './quiz-set.repository';

@Injectable()
export class QuizService {
    constructor(
        private quizRepository: QuizRepository,
        private quizSetRepository: QuizSetRepository,
    ) {}

    async createQuizSet(quizSetName: string) {
        const { id } = await this.quizSetRepository.save(new QuizSet(quizSetName));
        return id;
    }

    async createQuiz(quizSetId: number, createQuizDto: CreateQuizDto) {
        const quizSet = await this.quizSetRepository.findOneById(quizSetId);
        if (!quizSet) {
            throw new NotFoundException(`해당 퀴즈셋을 찾을 수 없습니다.`);
        }

        const quiz = createQuizDto.toEntity(quizSet);
        await this.quizRepository.save(quiz);
    }

    async getQuizzes(quizSetId: number) {
        const quizSet = await this.quizSetRepository.findOneById(quizSetId);
        if (!quizSet) {
            throw new NotFoundException(`해당 퀴즈셋을 찾을 수 없습니다.`);
        }

        return await this.quizRepository.findByQuizSetId(quizSetId);
    }
}
