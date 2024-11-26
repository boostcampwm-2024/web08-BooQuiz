import { QuizZone } from '@/types/quizZone.types';
import QuizWaiting from './QuizWaiting';
import QuizInProgress from './QuizInProgress';
import QuizCompleted from './QuizCompleted';
import { ChatMessage } from '@/types/quizZone.types';

interface QuizZoneInProgressProps {
    quizZoneState: QuizZone;
    sendChat: (chatMessage: ChatMessage) => void;
    submitAnswer: (answer: string) => void;
    playQuiz: () => void;
}

const QuizZoneInProgress = ({
    quizZoneState,
    sendChat,
    submitAnswer,
    playQuiz,
}: QuizZoneInProgressProps) => {
    const { currentPlayer, currentQuiz, chatMessages, currentQuizResult } = quizZoneState;
    const { id, nickname, state } = currentPlayer;
    const { playTime, startTime } = currentQuiz ?? {};

    switch (state) {
        case 'WAIT':
            return (
                <QuizWaiting
                    id={id}
                    nickname={nickname}
                    chatMessages={chatMessages ?? []}
                    startTime={startTime!}
                    playQuiz={playQuiz}
                    sendChat={sendChat}
                    currentQuizSummary={currentQuizResult}
                />
            );
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
                    id={id}
                    nickname={nickname}
                    chatMessages={chatMessages ?? []}
                    sendChat={sendChat}
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
