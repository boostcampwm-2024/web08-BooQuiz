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

//QuizZone 생성 관련 유효성 검사

//퀴즈존 이름 유효성 검사
export const validateQuizZoneSetName = (name: string) => {
    if (name.length <= 0) return '제목을 입력해주세요.';
    if (name.length > 100) return '100자 이하로 입력해주세요.';
};

//퀴즈존 설명 유효성 검사
export const validateQuizZoneSetDescription = (description: string) => {
    if (description.length > 300) return '300자 이하로 입력해주세요.';
};

//퀴즈존 입장 코드 유효성 검사
export const validateQuizZoneSetCode = (code: string) => {
    if (code.length < 5) return '5자 이상 입력해주세요.';
    if (code.length > 10) return '10자 이하로 입력해주세요.';
    if (!/^[a-zA-Z0-9]*$/g.test(code)) return '숫자와 알파벳 조합만 가능합니다.';
};

//입장 인원 제한 유효성 검사
export const validateQuizZoneSetLimit = (limit: number) => {
    if (limit < 1) return '최소 1명 이상 지정해주세요.';
    if (limit > 300) return '최대 인원은 300명입니다.';
};
