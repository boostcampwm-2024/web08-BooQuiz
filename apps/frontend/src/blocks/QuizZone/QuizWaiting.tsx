import ContentBox from '@/components/common/ContentBox';
import Typography from '@/components/common/Typogrpahy';
import ChatBox from '@/components/ui/chat-box';
import { useTimer } from '@/hook/useTimer';
import { useEffect } from 'react';
import { ChatMessage } from '@/types/quizZone.types';

interface QuizWaitingProps {
    id: string;
    nickname: string;
    startTime: number;
    sendChat: (chatMessage: ChatMessage) => void;
    playQuiz: () => void;
    currentQuizSummary?: {
        answer?: string;
        correctPlayerCount?: number;
        totalPlayerCount?: number;
    };
    chatMessages: ChatMessage[];
}

const QuizWaiting = ({
    id,
    nickname,
    playQuiz,
    sendChat,
    chatMessages,
    startTime,
    currentQuizSummary,
}: QuizWaitingProps) => {
    const currentTime = new Date().getTime();
    const remainingPrepTime = Math.max(0, startTime - currentTime) / 1000;
    const { answer, correctPlayerCount, totalPlayerCount } = currentQuizSummary ?? {};

    const isVisibleSummary =
        answer !== undefined &&
        totalPlayerCount !== undefined &&
        totalPlayerCount > 0 &&
        correctPlayerCount !== undefined;

    const { start, time } = useTimer({
        initialTime: remainingPrepTime,
        onComplete: () => {
            playQuiz();
        },
    });

    useEffect(() => {
        start();
    }, []);

    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <div className="w-full flex flex-row justify-center items-center gap-4">
                <ContentBox className="w-4/5 md:w-[48rem] gap-8 flex flex-col items-center box-border">
                    {isVisibleSummary && (
                        <div className="w-full flex flex-col items-center gap-2">
                            <Typography size="2xl" color="blue" text="정답: " bold={true} />
                            <Typography size="2xl" color="black" text={answer} bold={true} />
                            <Typography
                                size="2xl"
                                color="gray"
                                text={`정답률: ${(correctPlayerCount / totalPlayerCount) * 100}%`}
                                bold={true}
                            />
                        </div>
                    )}

                    <div className="w-full flex flex-col items-center gap-2">
                        <Typography
                            size="2xl"
                            color="gray"
                            text="다음 퀴즈를 준비 중입니다."
                            bold={true}
                        />
                        <Typography
                            size="2xl"
                            color="gray"
                            text="잠시만 기다려주세요"
                            bold={true}
                        />
                    </div>

                    {time !== null && (
                        <div className="w-full flex flex-row justify-center items-end">
                            <Typography
                                size="3xl"
                                color="blue"
                                text={`${time.toFixed(0)}`}
                                bold={true}
                            />
                            <Typography
                                size="base"
                                color="blue"
                                text={` 초 뒤에 시작`}
                                bold={true}
                            />
                        </div>
                    )}
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
                            chatMessages={chatMessages}
                            clientId={id}
                            nickname={nickname}
                            sendHandler={sendChat}
                        />
                    </div>
                </ContentBox>
            </div>
        </div>
    );
};

export default QuizWaiting;
