import CommonButton from '@/components/common/CommonButton';
import ContentBox from '@/components/common/ContentBox';
import Typography from '@/components/common/Typogrpahy';
import { useNavigate } from 'react-router-dom';

const QuizResultPage = () => {
    const navigate = useNavigate();
    const handleMoveToMain = () => {
        navigate('/');
    };
    return (
        <ContentBox>
            <Typography
                size="base"
                color="blue"
                text="퀴즈 풀이 하시느라 고생 많으셨습니다!"
                bold={true}
            />
            <CommonButton text="메인으로" clickEvent={handleMoveToMain} />
        </ContentBox>
    );
};

export default QuizResultPage;
