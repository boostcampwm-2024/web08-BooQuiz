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

    async createQuizSet(name: string): Promise<CreateQuizSetResponseDto> {
        const { id } = await this.quizSetRepository.save({ name });
        return { id };
    }

    async createQuizzes(quizSetId: number, createQuizDto: CreateQuizRequestDto[]) {
        const quizSet = await this.quizSetRepository.findOneBy({ id: quizSetId });
        if (!quizSet) {
            throw new BadRequestException(`해당 퀴즈셋을 찾을 수 없습니다.`);
        }

        const quiz = createQuizDto.toEntity(quizSet);
        await this.quizRepository.save(quiz);
        const quizzes = createQuizDto.map((dto) => {
            return dto.toEntity(quizSet);
        });

        await this.quizRepository.save(quizzes);
    }

    async getQuizzes(quizSetId: number) {
        const quizSet = await this.quizSetRepository.findOneBy({ id: quizSetId });
        if (!quizSet) {
            throw new BadRequestException(`해당 퀴즈셋을 찾을 수 없습니다.`);
        }

        const quizzes = await this.quizRepository.findBy({ quizSet: quizSet });
        return quizzes.map((quiz) => ({ ...quiz }));
    }
}
