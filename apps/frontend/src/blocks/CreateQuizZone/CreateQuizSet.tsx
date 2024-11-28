import { useState } from 'react';
import { Quiz } from '@/types/quizZone.types.ts';
import CandidateQuizzes from '@/blocks/CreateQuizZone/CandidateQuizzes.tsx';
import CreateQuiz from '@/blocks/CreateQuizZone/CreateQuiz.tsx';
import useValidState from '@/hook/useValidInput.ts';
import { requestCreateQuizSet } from '@/utils/requests.ts';
import { validQuizSetName, validQuizzes } from '@/utils/validators.ts';
import { QUIZ_LIMIT_COUNT } from '@/constants/quiz-set.constants.ts';

interface CreateQuizZoneQuizSetProps {
    handlePrevStepButton?: () => void;
    updateQuizSet?: (quizSetId: string, quizSetName: string) => void;
}

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

    const removeQuiz = (quiz: Quiz) => {
        setQuizzes([...quizzes].filter((q) => q !== quiz));
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
                    <CandidateQuizzes quizzes={quizzes} removeQuiz={removeQuiz} />
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
