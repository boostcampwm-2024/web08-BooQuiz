export type QuizZoneErrorType =
    | 'NOT_FOUND'
    | 'ALREADY_STARTED'
    | 'ROOM_FULL'
    | 'ALREADY_ENDED'
    | 'NOT_AUTHORIZED'
    | 'SESSION_ERROR'
    | 'QUIZ_COMPLETE'
    | 'VALIDATION_ERROR'
    | null;

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

export const quizZoneErrorMessages: Record<
    Exclude<QuizZoneErrorType, null>,
    { title: string; description: string }
> = {
    NOT_FOUND: {
        title: '찾을 수 없는 퀴즈존이에요',
        description: '퀴즈존이 없어졌거나 다른 곳으로 이동했어요',
    },
    ALREADY_STARTED: {
        title: '이미 시작된 퀴즈존이에요',
        description: '다음 퀴즈존을 기다려주세요',
    },
    ROOM_FULL: {
        title: '정원이 가득 찼어요',
        description: '다른 퀴즈존을 둘러보시는 건 어떨까요?',
    },
    ALREADY_ENDED: {
        title: '종료된 퀴즈존이에요',
        description: '새로운 퀴즈존에 도전해보세요',
    },
    NOT_AUTHORIZED: {
        title: '참여할 수 없는 퀴즈존이에요',
        description: '퀴즈존에 참여하지 않은 사용자예요',
    },
    SESSION_ERROR: {
        title: '일시적인 오류가 발생했어요',
        description: '잠시 후 다시 시도해주세요',
    },
    QUIZ_COMPLETE: {
        title: '퀴즈가 끝났어요',
        description: '모든 문제가 출제되었어요',
    },
    VALIDATION_ERROR: {
        title: '입력값이 올바르지 않아요',
        description: '입력 조건을 확인해주세요',
    },
};
