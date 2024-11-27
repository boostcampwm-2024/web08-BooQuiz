import { QuizSet } from '../entity/quiz-set.entity';

export class SearchQuizSetResponseDTO {

    readonly quizSetDetails: QuizSetDetails[];
    readonly meta: Page;
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

export class Page {
    readonly total: number;
    readonly page: number;
}