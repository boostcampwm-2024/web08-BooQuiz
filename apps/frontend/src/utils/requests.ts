import { QuizSet } from '@/types/quizZone.types.ts';
import { CreateQuizZone, ResponseSearchQuizSets } from '@/types/create-quiz-zone.types.ts';

export const requestCreateQuizZone = async (quizZone: CreateQuizZone) => {
    const response = await fetch('api/quiz-zone', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quizZone),
    });

    if (!response.ok) {
        throw new Error('퀴즈존 생성 처리중 오류가 발생하였습니다.');
    }
};
export const requestCreateQuizSet = async (quizSet: QuizSet) => {
    const { quizSetName, quizzes } = quizSet;

    const response = await fetch('api/quiz-set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            quizSetName,
            quizDetails: quizzes,
        }),
    });

    if (!response.ok) {
        throw Error();
    }

    return (await response.json()) as string;
};

export const requestSearchQuizSets = async (params: Record<string, string>) => {
    const searchParams = new URLSearchParams(params);
    const url = `api/quiz-set?${searchParams.toString()}`;

    const response = await fetch(url, {
        method: 'GET',
    });

    if (!response.ok) {
        console.log(response.status);
    }

    const { quizSetDetails, total, currentPage } =
        (await response.json()) as ResponseSearchQuizSets;

    return {
        quizSets: quizSetDetails,
        totalQuizSetCount: total,
        currentPage: currentPage,
    };
};
