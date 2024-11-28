import { Quiz } from '@/types/quizZone.types.ts';
import { QUIZ_LIMIT_COUNT } from '@/constants/quiz-set.constants.ts';

export const validQuizSetName = (name: string) => {
    if (name.length <= 0) return '퀴즈존 이름 입력을 확인하세요';
    if (name.length > 100) return '퀴즈존 이름 길이를 확인하세요. (최대 100자)';
};
export const validQuizzes = (quizzes: Quiz[]) => {
    if (quizzes.length === 0) return '퀴즈를 1개 이상 등록해야합니다.';
    if (quizzes.length > QUIZ_LIMIT_COUNT) return '퀴즈는 최대 10개만 등록할 수 있습니다.';
};
export const validQuestion = (question: string) => {
    if (question.length <= 0) return '문제를 입력해주세요.';
    if (question.length > 200) return '문제 길이를 초과하였습니다. 최대 200자';
};
export const validAnswer = (answer: string) => {
    if (answer.length <= 0) return '답안을 입력해주세요.';
    if (answer.length > 50) return '답안 길이를 초과하였습니다. 최대 50자';
};
export const validTime = (time: number) => {
    if (time <= 0) return '제한시간은 0초 보다 커야합니다.';
    if (time > 60) return '제한시간은 60초를 초과할 수 없습니다.';
};
