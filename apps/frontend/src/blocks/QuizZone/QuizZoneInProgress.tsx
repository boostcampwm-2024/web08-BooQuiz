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
    const { currentPlayer, currentQuiz } = quizZoneState;
    const { state } = currentPlayer;
    const { playTime, startTime } = currentQuiz ?? {};

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
            return (
                <QuizCompleted
                    isLastQuiz={quizZoneState.isLastQuiz ?? false}
                    deadlineTime={quizZoneState.currentQuiz?.deadlineTime ?? 0}
                    currentQuizResult={quizZoneState.currentQuizResult!}
                />
            );
        default:
            return null;
    }
};

export default QuizZoneInProgress;
