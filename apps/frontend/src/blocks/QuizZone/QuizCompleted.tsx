import ContentBox from '@/components/common/ContentBox';
import Typography from '@/components/common/Typogrpahy';
import ChatBox from '@/components/ui/chat-box';
import { ChatMessage } from '@/types/quizZone.types';
import { useTimer } from '@/hook/useTimer';
import { useEffect } from 'react';

interface QuizCompletedProps {
    id: string;
    nickname: string;
    chatMessages: ChatMessage[];
    sendChat: (chatMessage: ChatMessage) => void;
    isLastQuiz: boolean;
    deadlineTime: number;
}

const QuizCompleted = ({
    id,
    nickname,
    chatMessages,
    sendChat,
    isLastQuiz,
    deadlineTime,
}: QuizCompletedProps) => {
    const currentTime = new Date().getTime();
    const remainingPrepTime = Math.max(0, deadlineTime - currentTime) / 1000;

    const { start, time } = useTimer({
        initialTime: remainingPrepTime,
        onComplete: () => {},
    });

    useEffect(() => {
        start();
    }, []);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <img width="200px" src="/BooQuizLogo.png" alt="BooQuiz Logo" />
            <ContentBox>
                <div className="w-full flex flex-col items-center gap-2">
                    <Typography
                        size="3xl"
                        color="blue"
                        text={isLastQuiz ? '결과를 산출 중입니다.' : '다음 퀴즈를 준비 중입니다.'}
                        bold={true}
                    />
                    <Typography size="3xl" color="blue" text="잠시만 기다려주세요" bold={true} />
                    {!isLastQuiz && time !== null && (
                        <div className="w-full flex flex-row justify-center items-end">
                            <Typography
                                size="3xl"
                                color="blue"
                                text={`${time.toFixed(1)}`}
                                bold={true}
                            />
                            <Typography
                                size="base"
                                color="blue"
                                text={` 초 뒤에 다음문제로 넘어갑니다`}
                                bold={true}
                            />
                        </div>
                    )}
                </div>
                <div className="w-full flex flex-col items-center gap-2">
                    <Typography
                        size="base"
                        color="gray"
                        text="퀴즈가 시작되면 문제를 풀 수 있습니다."
                    />
                    <Typography
                        size="base"
                        color="gray"
                        text="다른 플레이어와 대화를 나눠보세요."
                    />
                    <ChatBox
                        chatMessages={chatMessages ?? []}
                        clientId={id}
                        nickname={nickname}
                        sendHandler={sendChat}
                    />
                </div>
            </ContentBox>
        </div>
    );
};

export default QuizCompleted;
