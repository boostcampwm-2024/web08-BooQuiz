import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateQuizSetRequestDto } from './dto/create-quiz-set-request.dto';
import { QuizRepository } from './repository/quiz.repository';
import { QuizSetRepository } from './repository/quiz-set.repository';
import { UpdateQuizRequestDto } from './dto/update-quiz-request.dto';
import { QuizSetDetails } from './dto/search-quiz-set-response.dto';
import { SearchQuizSetRequestDTO } from './dto/search-quiz-set-request.dto';
import { FindQuizzesResponseDto } from './dto/find-quizzes-response.dto';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class QuizService {
    constructor(
        private quizRepository: QuizRepository,
        private quizSetRepository: QuizSetRepository,
    ) {}

    @Transactional()
    async createQuizzes(createQuizDto: CreateQuizSetRequestDto) {
        const quizSet = await this.quizSetRepository.save({
            name: createQuizDto.quizSetName,
            recommended: createQuizDto.recommended,
        });

        const quizzes = createQuizDto.quizDetails.map((dto) => {
            return dto.toEntity(quizSet);
        });

        await this.quizRepository.save(quizzes);

        return quizSet.id;
    }

    async getQuizzes(quizSetId: number): Promise<FindQuizzesResponseDto[]> {
        const quizSet = await this.findQuizSet(quizSetId);
        return await this.quizRepository.findBy({ quizSet: { id: quizSetId } });
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

        await this.quizRepository.delete({ id: quizId });
    }

    async deleteQuizSet(quizSetId: number) {
        const quiz = await this.findQuizSet(quizSetId);

        await this.quizSetRepository.delete({ id: quizSetId });
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

        if(!name) {
            return this.findDefaultQuizSet(page, size);
        }

        const [quizSets, count] = await Promise.all([
            this.quizSetRepository.searchByName(name, page, size),
            this.quizSetRepository.countByName(name),
        ]);

        const quizSetDetails = quizSets.map(QuizSetDetails.from);
        return { quizSetDetails, total: count, currentPage: page };
    }

    private async findDefaultQuizSet(page: number, size: number) {
        const [quizSets, count] = await Promise.all([
            this.quizSetRepository.findByRecommend(page, size),
            this.quizSetRepository.countByRecommend()
        ]);
        const quizSetDetails = quizSets.map(QuizSetDetails.from);
        return {quizSetDetails, total: count, currentPage: page};
    }

    private async findDefaultQuizSet(page: number, size: number) {
        const [quizSets, count] = await Promise.all([
            this.quizSetRepository.findByRecommend(page, size),
            this.quizSetRepository.countByRecommend()
        ]);
        const quizSetDetails = quizSets.map(QuizSetDetails.from);
        return {quizSetDetails, total: count, currentPage: page};
    }

    private async findDefaultQuizSet(page: number, size: number) {
        const [quizSets, count] = await Promise.all([
            this.quizSetRepository.findByRecommend(page, size),
            this.quizSetRepository.countByRecommend()
        ]);
        const quizSetDetails = quizSets.map(QuizSetDetails.from);
        return {quizSetDetails, total: count, currentPage: page};
    }
}
