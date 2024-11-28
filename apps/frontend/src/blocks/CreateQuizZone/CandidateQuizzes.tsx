import { Quiz } from '@/types/quizZone.types.ts';

interface CandidateQuizProps {
    quizzes: Quiz[];
    removeQuiz: (quiz: Quiz) => void;
}

const CandidateQuizzes = ({ quizzes, removeQuiz }: CandidateQuizProps) => {
    return (
        <ul>
            {quizzes.map((quiz, i) => (
                <li key={i}>
                    <div>
                        <span>{quiz.quizType}</span>
                        <span>{quiz.playTime}</span>
                    </div>
                    <div>{quiz.question}</div>
                    <div>{quiz.answer}</div>
                    <button onClick={() => removeQuiz(quiz)}>삭제</button>
                </li>
            ))}
        </ul>
    );
};

export default CandidateQuizzes;