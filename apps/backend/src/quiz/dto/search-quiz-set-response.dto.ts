import { QuizSet } from '../entity/quiz-set.entity';

export class SearchQuizSetResponseDTO {

    readonly quizSetDetails: QuizSetDetails[];
    readonly total: number;
    readonly currentPage: number;
}

export class QuizSetDetails {
    readonly id: number;
    readonly name: string;

    static from(quizSet : QuizSet) : QuizSetDetails {
        return {
            id: quizSet.id,
            name: quizSet.name,
        };
    }
}