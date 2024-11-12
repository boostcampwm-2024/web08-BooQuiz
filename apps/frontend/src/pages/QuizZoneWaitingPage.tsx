import CommonButton from '@/components/common/CommonButton';
import ContentBox from '@/components/common/ContentBox';
import { useNavigate } from 'react-router-dom';

const QuizZoneWaitingPage = () => {
    const navigate = useNavigate();

    const handleStartQuiz = () => {
        navigate('/quiz');
    };

    return (
        <ContentBox>
            <div className="w-full h-full flex flex-col gap-8 items-center justify-center">
                <img className="w-[20rem]" src="/BooQuizLogo.png" alt="BooQuiz Logo" />
                <CommonButton text="퀴즈 시작하기" clickEvent={handleStartQuiz} />
            </div>
        </ContentBox>
    );
};

export default QuizZoneWaitingPage;
