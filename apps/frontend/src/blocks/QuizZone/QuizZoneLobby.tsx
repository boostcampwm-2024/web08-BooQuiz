import CommonButton from '@/components/common/CommonButton';
import ContentBox from '@/components/common/ContentBox';
import Typography from '@/components/common/Typogrpahy';

interface QuizZoneLobbyProps {
    quizZoneData: any;
    pinNumber: string;
    startQuiz: () => void;
}

const QuizZoneLobby = ({ quizZoneData, pinNumber, startQuiz }: QuizZoneLobbyProps) => {
    console.log(quizZoneData);
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <img className="w-[20rem]" src="/BooQuizLogo.png" alt="BooQuiz Logo" />
            <ContentBox>
                <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
                    <Typography text={`Room: ${pinNumber}`} size="2xl" color="black" bold={true} />
                    {quizZoneData && (
                        <div>
                            <p>퀴즈 수: {quizZoneData?.Lobby.totalQuizCount}</p>
                            <p>참가자 수: {quizZoneData.Lobby.participants}</p>
                            <p>퀴즈 제목: {quizZoneData.Lobby.quizTitle}</p>
                            {quizZoneData.Lobby.isHost && (
                                <CommonButton text="퀴즈 시작하기" clickEvent={startQuiz} />
                            )}
                        </div>
                    )}
                </div>
            </ContentBox>
        </div>
    );
};

export default QuizZoneLobby;
