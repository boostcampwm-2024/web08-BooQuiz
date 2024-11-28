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
    const [time, timeInvalidMessage, setTime, isInvalidTime] = useValidState<number>(30, validTime);
    const [type, typeInvalidMessage, setType, isInvalidType] = useValidState<ProblemType>(
        'SHORT',
        () => {},
    );

    const isInvalid = () => isInvalidQuestion || isInvalidAnswer || isInvalidTime || isInvalidType;

    const handleComplete = () => {
        if (isInvalid()) {
            // 알럿 추가
            console.log('입력 조건을 확인해주세요.');
            return;
        }

        handleCreateQuiz({
            question: question,
            answer: answer,
            type: type,
            playTime: time,
        });
    };

    return (
        <div>
            <div>
                <strong>퀴즈 유형</strong>
                <div className={isInvalidTime ? 'invalid' : ''}>
                    <label className="">단답형</label>
                    <input
                        type="radio"
                        name={'type'}
                        value={'SHORT'}
                        checked={type === 'SHORT'}
                        onChange={(e) => setType(e.target.value as ProblemType)}
                    />
                    <span>{typeInvalidMessage}</span>
                </div>
            </div>
            <div className={isInvalidTime ? 'invalid' : ''}>
                <label htmlFor="time">풀이 시간</label>
                <input
                    type="number"
                    id="time"
                    min={1}
                    max={60}
                    value={time}
                    onChange={(e) => setTime(parseInt(e.target.value))}
                />
                {isInvalidTime && <span>{timeInvalidMessage}</span>}
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
