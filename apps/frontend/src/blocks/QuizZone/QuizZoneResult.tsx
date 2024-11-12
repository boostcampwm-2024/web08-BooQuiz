import CommonButton from '@/components/common/CommonButton';
import ContentBox from '@/components/common/ContentBox';
import Typography from '@/components/common/Typogrpahy';
import { useNavigate } from 'react-router-dom';

interface QuizZoneResultProps {
    quizZoneData: any;
    quizProgress: any;
}

const QuizZoneResult = ({ quizZoneData, quizProgress }: QuizZoneResultProps) => {
    const navigate = useNavigate();
    const handleMoveToMain = () => {
        navigate('/');
    };
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <img className="w-[20rem]" src="/BooQuizLogo.png" alt="BooQuiz Logo" />
            <ContentBox>
                <Typography
                    size="base"
                    color="blue"
                    text="퀴즈 풀이 하시느라 고생 많으셨습니다!"
                    bold={true}
                />
                <Typography
                    size="base"
                    color="blue"
                    text={`최종 점수: ${quizZoneData.result.score}%`}
                    bold={true}
                />
                <Typography
                    size="base"
                    color="blue"
                    text={`순위: ${quizZoneData.result.rank}/${quizZoneData.result.totalParticipants}%`}
                    bold={true}
                />
                <Typography
                    size="base"
                    color="blue"
                    text={`정답 개수: ${quizZoneData.result.correctAnswers}/${quizProgress.totalQuizzes}`}
                    bold={true}
                />
                <CommonButton text="메인으로" clickEvent={handleMoveToMain} />
            </ContentBox>
        </div>
    );
};

export default QuizZoneResult;
