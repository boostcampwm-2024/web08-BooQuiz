import { SubmittedQuiz } from '../../quiz-zone/entities/submitted-quiz.entity';
import { Quiz } from '../../quiz-zone/entities/quiz.entity';

/**
 * 퀴즈 결과 출력을 위한 DTO
 * 
 * @property score - 퀴즈 결과/점수
 * @property submits - 플레이어가 제출한 퀴즈 목록
 * @property quizzes - 전체 퀴즈 목록
 */
export interface QuizResultSummaryDto {
    score: number;
    submits: SubmittedQuiz[];
    quizzes: Quiz[];
}
