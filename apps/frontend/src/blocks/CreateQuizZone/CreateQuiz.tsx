import { ProblemType, Quiz } from '@/types/quizZone.types.ts';
import useValidState from '@/hook/useValidInput.ts';
import { validAnswer, validQuestion, validTime } from '@/utils/validators.ts';

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
    const [quizType, typeInvalidMessage, setQuizType, isInvalidQuizType] =
        useValidState<ProblemType>('SHORT', () => {});

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
        <div>
            <div>
                <strong>퀴즈 유형</strong>
                <div className={isInvalidPlayTime ? 'invalid' : ''}>
                    <label className="">단답형</label>
                    <input
                        type="radio"
                        name={'type'}
                        value={'SHORT'}
                        checked={quizType === 'SHORT'}
                        onChange={(e) => setQuizType(e.target.value as ProblemType)}
                    />
                    <span>{typeInvalidMessage}</span>
                </div>
            </div>
            <div className={isInvalidPlayTime ? 'invalid' : ''}>
                <label htmlFor="time">풀이 시간</label>
                <input
                    type="number"
                    id="time"
                    min={1}
                    max={60}
                    value={playTime}
                    onChange={(e) => setPlayTime(parseInt(e.target.value))}
                />
                {isInvalidPlayTime && <span>{timeInvalidMessage}</span>}
            </div>
            <div className={isInvalidQuestion ? 'invalid' : ''}>
                <label htmlFor="question" className="">
                    질문
                </label>
                <input
                    type="text"
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                {isInvalidQuestion && <span>{questionInvalidMessage}</span>}
            </div>
            <div className={isInvalidAnswer ? 'invalid' : ''}>
                <label htmlFor="answer">정답</label>
                <input
                    type="text"
                    id="answer"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                />
                {isInvalidAnswer && <span>{answerInvalidMessage}</span>}
            </div>
            <button onClick={() => handleComplete()} disabled={isInvalid()}>
                완료
            </button>
        </div>
    );
};

export default CreateQuiz;
