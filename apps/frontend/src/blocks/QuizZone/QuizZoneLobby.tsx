import CommonButton from '@/components/common/CommonButton';
import ContentBox from '@/components/common/ContentBox';
import CustomAlert from '@/components/common/CustomAlert';
import TextCopy from '@/components/common/TextCopy';
import Typography from '@/components/common/Typogrpahy';
import { useNavigate } from 'react-router-dom';
import { QuizZone, ChatMessage } from '@/types/quizZone.types';
import PlayersGrid from '@/components/common/PlayersGrid';
import TooltipWrapper from '@/components/common/TooltipWrapper';
import { cn } from '@/lib/utils';

interface QuizZoneLobbyProps {
    quizZoneState: QuizZone;
    quizZoneId: string;
    maxPlayers: number;
    sendChat: (chatMessage: ChatMessage) => void;
    startQuiz: () => void;
    exitQuiz: () => void;
}

const QuizZoneLobby = ({
    quizZoneState,
    quizZoneId,
    maxPlayers,
    startQuiz,
    exitQuiz,
}: QuizZoneLobbyProps) => {
    const navigate = useNavigate();
    const handleLeave = () => {
        exitQuiz();
        navigate('/');
    };

    const { currentPlayer } = quizZoneState;
    const isHost = quizZoneState.hostId === currentPlayer.id;

    // 공통으로 사용되는 스타일 정의
    const contentBoxStyle = 'min-h-0';
    const flexColumnGap = 'flex flex-col gap-1';

    const renderInfoItem = (
        label: string,
        value: string | number,
        valueSize: 'xl' | '2xl' = '2xl',
    ) => (
        <div className={flexColumnGap}>
            <Typography text={label} size="base" color="black" />
            <Typography text={value.toString()} size={valueSize} color="black" bold={true} />
        </div>
    );

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
            <ContentBox className="w-full flex-1 min-h-0 h-full bg-white shadow-lg">
                {/* 모바일에서는 세로로, md 이상에서는 가로로 배치 */}
                <div className="w-full min-h-0 h-full flex flex-col md:flex-row gap-4 items-stretch">
                    {/* 퀴즈 정보 섹션 - 모바일에서는 전체 너비, md 이상에서는 30% */}
                    <ContentBox
                        className={cn(
                            'w-full md:w-2/5 p-4 flex flex-col justify-between h-full',
                            contentBoxStyle,
                        )}
                    >
                        <div className={flexColumnGap}>
                            <Typography
                                text={`${quizZoneState.title}`}
                                size="3xl"
                                color="black"
                                bold={true}
                            />
                            <Typography
                                text={quizZoneState.description}
                                size="xs"
                                color="gray"
                                bold={true}
                            />
                        </div>

                        <div className="flex flex-col gap-6 my-4">
                            <div className={flexColumnGap}>
                                <Typography text="입장코드" size="base" color="black" />
                                <TooltipWrapper content="입장코드를 복사할 수 있습니다.">
                                    <TextCopy size="xl" bold={true} text={quizZoneId} />
                                </TooltipWrapper>
                            </div>
                            {renderInfoItem('퀴즈 개수', `${quizZoneState.quizCount ?? '?'}문제`)}
                            {renderInfoItem(
                                '현재 참여자',
                                `${quizZoneState.players?.length ?? '?'} / ${maxPlayers ?? '?'} 명`,
                            )}
                        </div>

                        <div className="flex flex-col gap-2 mt-auto">
                            {isHost ? (
                                <CommonButton text="퀴즈 시작하기" clickEvent={startQuiz} />
                            ) : (
                                <CommonButton
                                    text="대기 중입니다..."
                                    disabled={true}
                                    clickEvent={() => {}}
                                />
                            )}
                            <CustomAlert
                                trigger={{
                                    text: '나가기',
                                    variant: 'outline',
                                }}
                                alert={{
                                    title: '메인페이지로 이동하시겠습니까?',
                                    description: '이 작업은 취소할 수 없습니다.',
                                    type: 'info',
                                }}
                                onConfirm={handleLeave}
                                onCancel={() => {}}
                            />
                        </div>
                    </ContentBox>

                    {/* 참가자 목록 섹션 - 모바일에서는 전체 너비, md 이상에서는 70% */}
                    <ContentBox
                        className={cn(
                            'w-full md:w-3/5 p-4 flex flex-col justify-between flex-1',
                            contentBoxStyle,
                        )}
                    >
                        <div className="flex flex-col min-h-80 flex-1">
                            <div className={flexColumnGap}>
                                <Typography
                                    text="참가자 목록"
                                    size="base"
                                    color="black"
                                    bold={true}
                                />
                                <Typography
                                    text="현재 접속 중인 참가자들입니다"
                                    size="xs"
                                    color="gray"
                                />
                            </div>
                            <div className="flex-1 mt-4 h-full min-h-0 overflow-y-auto">
                                <PlayersGrid
                                    currentPlayer={quizZoneState.currentPlayer}
                                    players={quizZoneState.players ?? []}
                                    hostId={quizZoneState.hostId}
                                    className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4"
                                />
                            </div>
                        </div>
                    </ContentBox>
                </div>
            </ContentBox>
        </div>
    );
};

export default QuizZoneLobby;
