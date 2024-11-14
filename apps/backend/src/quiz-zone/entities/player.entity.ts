import { SubmittedQuiz } from './submitted-quiz.entity';

export interface Player {
    id: string;
    score: number;
    submits: SubmittedQuiz[];
    state: 'WAIT' | 'PLAY' | 'SUBMIT';
}
