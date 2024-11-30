import { useState } from 'react';
import { Quiz } from '@/types/quizZone.types.ts';
import CandidateQuizzes from '@/blocks/CreateQuizZone/CandidateQuizzes.tsx';
import CreateQuiz from '@/blocks/CreateQuizZone/CreateQuiz.tsx';
import useValidState from '@/hook/useValidInput.ts';
import { requestCreateQuizSet } from '@/utils/requests.ts';
import { validQuizSetName, validQuizzes } from '@/utils/validators.ts';
import { QUIZ_LIMIT_COUNT } from '@/constants/quiz-set.constants.ts';
import Input from '@/components/common/Input';
import ContentBox from '@/components/common/ContentBox';
import Typography from '@/components/common/Typogrpahy';
import CommonButton from '@/components/common/CommonButton';

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
        <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            <ContentBox className="gap-2 xs:max-w-xs md:max-w-md w-full">
                <Input
                    label="퀴즈셋 이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="quiz-zone-id"
                    isBorder={true}
                />
                {validNameMessage && <Typography text={validNameMessage} size="xs" color="red" />}
                <CandidateQuizzes quizzes={quizzes} removeQuiz={removeQuiz} />
                {validQuizzesMessage && <span>{validQuizzesMessage}</span>}
                <CreateQuiz handleCreateQuiz={addQuiz} />

                <CommonButton
                    isFilled={true}
                    clickEvent={() => createQuizSet()}
                    disabled={isInvalid()}
                >
                    퀴즈셋 만들기
                </CommonButton>
            </ContentBox>
            {handlePrevStepButton && (
                <CommonButton className="min-w-[15rem]" clickEvent={() => handlePrevStepButton()}>
                    돌아가기
                </CommonButton>
            )}
        </div>
    );
};

export default CreateQuizSet;
