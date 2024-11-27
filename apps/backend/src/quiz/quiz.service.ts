import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuizRequestDto } from './dto/create-quiz-request.dto';
import { QuizRepository } from './repository/quiz.repository';
import { QuizSetRepository } from './repository/quiz-set.repository';
import { UpdateQuizRequestDto } from './dto/update-quiz-request.dto';
import { QuizSetDetails } from './dto/search-quiz-set-response.dto';
import { SearchQuizSetRequestDTO } from './dto/search-quiz-set-request.dto';
import { FindQuizzesResponseDto } from './dto/find-quizzes-response.dto';

@Injectable()
export class QuizService {
    constructor(
        private quizRepository: QuizRepository,
        private quizSetRepository: QuizSetRepository,
    ) {}

    async createQuizzes(createQuizDto: CreateQuizRequestDto) {
        const quizSet = await this.quizSetRepository.save({ name: createQuizDto.quizSetName });

        const quizzes = createQuizDto.quizDetails.map((dto) => {
            return dto.toEntity(quizSet);
        });

        await this.quizRepository.save(quizzes);

        return quizSet.id;
    }

    async getQuizzes(quizSetId: number): Promise<FindQuizzesResponseDto[]> {
        const quizSet = await this.findQuizSet(quizSetId);
        return await this.quizRepository.findBy({ quizSet: quizSet });
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
        await this.findQuiz(quizId);

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

    async searchQuizSet(searchQuery: SearchQuizSetRequestDTO) {
        const { name, page, size } = searchQuery;
        const [quizSets, count] = await Promise.all([
            this.quizSetRepository.searchByName(name, page, size),
            this.quizSetRepository.countByName(name),
        ]);

        const quizSetDetails = quizSets.map(QuizSetDetails.from);
        const meta = { total: count, page: page };

        return { quizSetDetails, meta };
    }
}
