import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuizRequestDto } from './dto/create-quiz-request.dto';
import { CreateQuizSetResponseDto } from './dto/create-quiz-set-response.dto';
import { QuizRepository } from './repository/quiz.repository';
import { QuizSetRepository } from './repository/quiz-set.repository';
import { UpdateQuizRequestDto } from './dto/update-quiz-request.dto';

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
        const quizSet = await this.findQuizSet(quizSetId);

        const quizzes = createQuizDto.map((dto) => {
            return dto.toEntity(quizSet);
        });

        await this.quizRepository.save(quizzes);
    }

    async getQuizzes(quizSetId: number) {
        const quizSet = await this.findQuizSet(quizSetId);

        const quizzes = await this.quizRepository.findBy({ quizSet: quizSet });
        return quizzes.map((quiz) => ({ ...quiz }));
    }

    async updateQuiz(quizId: number, updateQuizRequestDto: UpdateQuizRequestDto) {
        const quiz = await this.findQuiz(quizId);

        const updatedQuiz = {
            ...quiz,
            ...updateQuizRequestDto,
        };

        await this.quizRepository.save(updatedQuiz);
    }

    async deleteQuiz(quizId: number) {
        const quiz = await this.findQuiz(quizId);

        // 퀴즈 존재하면 삭제
        await this.quizRepository.delete({ id: quizId });
    }

    async findQuizSet(quizSetId: number) {
        const quizSet = await this.quizSetRepository.findOneBy({ id: quizSetId });
        if (!quizSet) {
            throw new BadRequestException(`해당 퀴즈셋을 찾을 수 없습니다.`);
        }

        return quizSet;
    }

    async findQuiz(quizId: number) {
        const quiz = await this.quizRepository.findOneBy({ id: quizId });
        if (!quiz) {
            throw new BadRequestException(`퀴즈를 찾을 수 없습니다.`);
        }

        return quiz;
    }
}
