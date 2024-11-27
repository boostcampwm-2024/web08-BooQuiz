import { ProblemType, Quiz } from '@/types/quizZone.types.ts';
import useValidState from '@/hook/useValidInput.ts';

interface CreateQuizProps {
    handleCreateQuiz: (quiz: Quiz) => void;
}

const validQuestion = (question: string) => {
    if (question.length <= 0) return '문제를 입력해주세요.';
    if (question.length > 200) return '문제 길이를 초과하였습니다. 최대 200자';
};

const validAnswer = (answer: string) => {
    if (answer.length <= 0) return '답안을 입력해주세요.';
    if (answer.length > 50) return '답안 길이를 초과하였습니다. 최대 50자';
};

const validTime = (time: number) => {
    if (time <= 0) return '제한시간은 0초 보다 커야합니다.';
    if (time > 60) return '제한시간은 60초를 초과할 수 없습니다.';
};

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
