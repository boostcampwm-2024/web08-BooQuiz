import { ProblemType, Quiz } from '@/types/quizZone.types.ts';
import useValidState from '@/hook/useValidInput.ts';
import { validAnswer, validQuestion, validTime } from '@/utils/validators.ts';
import ContentBox from '@/components/common/ContentBox';
import Typography from '@/components/common/Typogrpahy';
import Input from '@/components/common/Input';
import CommonButton from '@/components/common/CommonButton';

interface CreateQuizProps {
    handleCreateQuiz: (quiz: Quiz) => void;
}

const CreateQuiz = ({ handleCreateQuiz }: CreateQuizProps) => {
    const [question, questionInvalidMessage, setQuestion, isInvalidQuestion] =
        useValidState<string>('', validQuestion);
    const [answer, answerInvalidMessage, setAnswer, isInvalidAnswer] = useValidState<string>(
        '',
        validAnswer,
    );
    const [playTime, timeInvalidMessage, setPlayTime, isInvalidPlayTime] = useValidState<number>(
        30,
        validTime,
    );
    const [quizType, _, __, isInvalidQuizType] = useValidState<ProblemType>('SHORT', () => {});

    const isInvalid = () =>
        isInvalidQuestion || isInvalidAnswer || isInvalidPlayTime || isInvalidQuizType;

    const handleComplete = () => {
        if (isInvalid()) {
            // 알럿 추가
            console.log('입력 조건을 확인해주세요.');
            return;
        }

        handleCreateQuiz({
            question,
            answer,
            quizType,
            playTime,
        });
    };

    return (
        <ContentBox className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 justify-between">
                {/* <div className={isInvalidTime ? 'invalid' : ''}>
                        <label className="">단답형</label>
                        <input
                            type="radio"
                            name={'type'}
                            value={'SHORT'}
                            checked={type === 'SHORT'}
                            onChange={(e) => setType(e.target.value as ProblemType)}
                        />
                        {isInvalidType && (
                            <Typography size="xs" color="red" text={typeInvalidMessage} />
                        )}
                    </div> */}
                <div className={isInvalidPlayTime ? 'invalid' : ''}>
                    <Input
                        type="number"
                        name="time"
                        label="풀이 시간"
                        min={1}
                        max={60}
                        value={playTime}
                        onChange={(e) => setPlayTime(parseInt(e.target.value))}
                        isBorder={true}
                    />
                    {isInvalidPlayTime && (
                        <Typography size="xs" color="red" text={timeInvalidMessage} />
                    )}
                </div>
            </div>
            <div className={isInvalidQuestion ? 'invalid' : ''}>
                <Input
                    type="text"
                    name="question"
                    label="질문"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    isBorder={true}
                    error={isInvalidQuestion && questionInvalidMessage}
                />
                {/* {isInvalidQuestion && (
                    <Typography size="xs" color="red" text={questionInvalidMessage} />
                )} */}
            </div>
            <div className={isInvalidAnswer ? 'invalid' : ''}>
                <Input
                    type="text"
                    name="answer"
                    label="정답"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    isBorder={true}
                    error={isInvalidAnswer && answerInvalidMessage}
                />
                {/* {isInvalidAnswer && (
                    <Typography size="xs" color="red" text={answerInvalidMessage} />
                )} */}
            </div>
            <CommonButton clickEvent={() => handleComplete()} disabled={isInvalid()}>
                추가하기
            </CommonButton>
        </ContentBox>
    );
};

export default CreateQuiz;
