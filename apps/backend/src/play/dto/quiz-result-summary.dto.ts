import { SubmittedQuiz } from '../../quiz-zone/entities/submitted-quiz.entity';
import { Quiz } from '../../quiz-zone/entities/quiz.entity';

export interface QuizResultSummaryDto {
    score: number;
    submits: SubmittedQuiz[];
    quizzes: Quiz[];
}
