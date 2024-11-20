import { QuizZone } from '@/types/quizZone.types';
import QuizWaiting from './QuizWaiting';
import QuizInProgress from './QuizInProgress';
import QuizCompleted from './QuizCompleted';

interface QuizZoneInProgressProps {
    quizZoneState: QuizZone;
    submitAnswer: (answer: string) => void;
    playQuiz: () => void;
}

const QuizZoneInProgress = ({ quizZoneState, submitAnswer, playQuiz }: QuizZoneInProgressProps) => {
    const { currentPlayer, currentQuiz, stage } = quizZoneState;
    const { state } = currentPlayer;
    const { playTime, startTime } = currentQuiz ?? {};
    console.log(startTime, state);
    switch (state) {
        case 'WAIT':
            return <QuizWaiting startTime={startTime!} playQuiz={playQuiz} />;
        case 'PLAY':
            return (
                <QuizInProgress
                    playTime={playTime!}
                    currentQuiz={currentQuiz}
                    submitAnswer={submitAnswer}
                />
            );
        case 'SUBMIT':
            const isLastQuiz =
                quizZoneState.quizCount === quizZoneState.currentQuiz?.currentIndex ||
                stage == 'RESULT';
            return <QuizCompleted isLastQuiz={isLastQuiz} />;
        default:
            return null;
    }
};

export default QuizZoneInProgress;
