import { QuizZoneErrorType, ValidationError } from '@/types/error.types';

export const getQuizZoneErrorType = (error: unknown): QuizZoneErrorType => {
    if (error instanceof ValidationError) {
        return 'VALIDATION_ERROR';
    }
    if (error instanceof Response) {
        switch (error.status) {
            case 404:
                return 'NOT_FOUND';
            case 409:
                return 'ALREADY_STARTED';
            case 400:
                return 'NOT_AUTHORIZED';
            default:
                return 'SESSION_ERROR';
        }
    }

    if (error instanceof Error) {
        switch (error.message) {
            case '퀴즈존 정원이 초과되었습니다.':
                return 'ROOM_FULL';
            case '이미 종료된 퀴즈존입니다.':
                return 'ALREADY_ENDED';
            case '퀴즈가 모두 종료되었습니다.':
                return 'QUIZ_COMPLETE';
            default:
                return 'SESSION_ERROR';
        }
    }

    return 'SESSION_ERROR';
};
