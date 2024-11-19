import { QuizZone } from '@/types/quizZone.types';
import QuizWaiting from './QuizWaiting';
import QuizInProgress from './QuizInProgress';

interface QuizZoneInProgressProps {
    quizZoneState: QuizZone;
    submitAnswer: (answer: string) => void;
    playQuiz: () => void;
}

const QuizZoneInProgress = ({ quizZoneState, submitAnswer, playQuiz }: QuizZoneInProgressProps) => {
    const { currentPlayer, currentQuiz } = quizZoneState;
    const { state } = currentPlayer;
    const { playTime, startTime, deadlineTime } = currentQuiz;
    console.log(startTime, state);
    switch (state) {
        case 'WAIT':
            return <QuizWaiting startTime={startTime} playQuiz={playQuiz} />;
        case 'PLAY':
            return (
                <QuizInProgress
                    playTime={playTime}
                    currentQuiz={currentQuiz}
                    submitAnswer={submitAnswer}
                />
            );
        // case 'SUBMIT':
        //     return <QuizWaiting />;
        default:
            return null;
    }
};

export default QuizZoneInProgress;
