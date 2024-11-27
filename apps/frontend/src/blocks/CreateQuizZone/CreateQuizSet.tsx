import { useState } from 'react';
import { Quiz, QuizSet } from '@/types/quizZone.types.ts';
import CandidateQuizzes from '@/blocks/CreateQuizZone/CandidateQuizzes.tsx';
import CreateQuiz from '@/blocks/CreateQuizZone/CreateQuiz.tsx';
import useValidState from '@/hook/useValidInput.ts';

interface CreateQuizZoneQuizSetProps {
    handlePrevStepButton?: () => void;
    updateQuizSet?: (quizSetId: string, quizSetName: string) => void;
}

const QUIZ_LIMIT_COUNT = 10;

const requestCreateQuizSet = async (quizSet: QuizSet) => {
    const { quizSetName, quizzes } = quizSet;

    const response = await fetch('api/quiz', {
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

const validQuizSetName = (name: string) => {
    if (name.length <= 0) return '퀴즈존 이름 입력을 확인하세요';
    if (name.length > 100) return '퀴즈존 이름 길이를 확인하세요. (최대 100자)';
};

const validQuizzes = (quizzes: Quiz[]) => {
    if (quizzes.length === 0) return '퀴즈를 1개 이상 등록해야합니다.';
    if (quizzes.length > QUIZ_LIMIT_COUNT) return '퀴즈는 최대 10개만 등록할 수 있습니다.';
};

const CreateQuizSet = ({ handlePrevStepButton, updateQuizSet }: CreateQuizZoneQuizSetProps) => {
    const [name, validNameMessage, setName, isInvalidName] = useValidState<string>(
        '',
        validQuizSetName,
    );
    const [quizzes, validQuizzesMessage, setQuizzes, isInvalidQuizzes] = useValidState<Quiz[]>(
        [],
        validQuizzes,
    );

    const [isLoading, setIsLoading] = useState(false);

    const isInvalid = () => isInvalidName || isInvalidQuizzes;

    const createQuizSet = async () => {
        try {
            if (isLoading || isInvalid()) {
                return;
            }

            setIsLoading(true);

            const quizSetId = await requestCreateQuizSet({
                quizSetName: name,
                quizzes: quizzes,
            });

            console.log(quizSetId);
            updateQuizSet?.(quizSetId, name);
            handlePrevStepButton?.();
        } catch (error) {
            // 얼럿 추가
            console.error('퀴즈 생성 처리중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const addQuiz = (quiz: Quiz) => {
        if (quizzes.length >= QUIZ_LIMIT_COUNT) {
            // 얼럿 추가
            console.log('퀴즈 제한 숫자를 초과하였습니다.');
        }

        setQuizzes([...quizzes, quiz]);
    };

    return (
        <div>
            <div>
                <div className="">
                    <label htmlFor="quiz-zone-id" className="">
                        퀴즈셋 이름
                    </label>
                    <input
                        type="text"
                        id="quiz-zone-id"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {validNameMessage && <span>{validNameMessage}</span>}
                </div>
                <div>
                    <CandidateQuizzes quizzes={quizzes} />
                    {validQuizzesMessage && <span>{validQuizzesMessage}</span>}
                </div>
            </div>
            <CreateQuiz handleCreateQuiz={addQuiz} />
            <div>
                {handlePrevStepButton && (
                    <button onClick={() => handlePrevStepButton()}>돌아가기</button>
                )}
                <button onClick={() => createQuizSet()} disabled={isInvalid()}>
                    퀴즈셋 만들기
                </button>
            </div>
        </div>
    );
};

export default CreateQuizSet;
