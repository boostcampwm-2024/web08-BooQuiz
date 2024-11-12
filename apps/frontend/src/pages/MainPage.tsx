import CommonButton from '@/components/common/CommonButton';
import ContentBox from '@/components/common/ContentBox';
import Typography from '@/components/common/Typogrpahy';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const navigate = useNavigate();

    const handleMoveToQuizZoneWaiting = () => {
        navigate('/quizZone');
    };

    return (
        <>
            <img src="/BooQuizLogo.png" alt="BooQuiz Logo" />
            <Typography
                size="2xl"
                color="blue"
                text="실시간 퀴즈 플랫폼 BooQuiz에 오신 것을 환영합니다!"
                bold={true}
            />
            <ContentBox>
                <Typography size="base" color="blue" text="퀴즈 참여하기" bold={true} />
                <Typography
                    size="xs"
                    color="gray"
                    text="버튼을 눌러 퀴즈존에 참여해보세요"
                    bold={true}
                />
                <CommonButton
                    text="퀴즈존 참여하기"
                    isFulfill={true}
                    clickEvent={handleMoveToQuizZoneWaiting}
                />
            </ContentBox>
        </>
    );
};

export default MainPage;
