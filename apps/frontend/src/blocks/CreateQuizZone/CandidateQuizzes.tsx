import { Quiz } from '@/types/quizZone.types.ts';

interface CandidateQuizProps {
    quizzes: Quiz[];
}

const CandidateQuizzes = ({ quizzes }: CandidateQuizProps) => {
    return (
        <ul>
            {quizzes.map((quiz) => (
                <li>
                    <div>
                        <span>{quiz.type}</span>
                        <span>{quiz.playTime}</span>
                    </div>
                    <div>{quiz.question}</div>
                    <div>{quiz.answer}</div>
                </li>
            ))}
        </ul>
    );
};

export default CandidateQuizzes;
