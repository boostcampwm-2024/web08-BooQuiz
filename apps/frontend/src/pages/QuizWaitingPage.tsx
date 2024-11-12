import ContentBox from '@/components/common/ContentBox';
import TimerDisplay from '@/components/common/TimerDisplay';
import Typography from '@/components/common/Typogrpahy';
import { useNavigate } from 'react-router-dom';

const QuizWaitingPage = () => {
    const navigate = useNavigate();

    const handleMoveToQuiz = () => {
        navigate('/quiz');
    };
    return (
        <>
            <img width="200px" src="/BooQuizLogo.png" alt="BooQuiz Logo" />
            <ContentBox>
                <div className="w-full flex flex-col items-center gap-2">
                    <Typography
                        size="3xl"
                        color="blue"
                        text="다음 퀴즈를 준비 중입니다."
                        bold={true}
                    />
                    <Typography size="3xl" color="blue" text="잠시만 기다려주세요" bold={true} />
                </div>
                <TimerDisplay time={3} isFulfill={true} onTimeEnd={handleMoveToQuiz} />
            </ContentBox>
        </>
    );
};

export default QuizWaitingPage;
