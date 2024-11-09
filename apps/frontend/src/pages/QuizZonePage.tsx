import CommonButton from '@/components/common/CommonButton';
import ContentBox from '@/components/common/ContentBox';
import Input from '@/components/common/Input';
import ProgressBar from '@/components/common/ProgressBar';
import Typography from '@/components/common/Typogrpahy';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const QuizZonePage = () => {
    const [answer, setAnswer] = useState('');
    const [question] = useState('저희 팀의 이름은 무엇인가요?');
    const navigate = useNavigate();

    const handleMoveToWaiting = () => {
        navigate('/waiting');
    };

    const handleMoveToResult = () => {
        navigate('/result');
    };

    return (
        <>
            <img width="200px" src="/BooQuizLogo.png" alt="BooQuiz Logo" />
            <ProgressBar maxTime={10} onTimeEnd={handleMoveToWaiting} />
            <ContentBox>
                <Typography text={`Q. ${question}`} size="2xl" color="black" bold={true} />
                <Input
                    onChange={(e) => setAnswer(e.target.value)}
                    name="quizAnswer"
                    value={answer}
                    placeholder={'정답을 입력해주세요'}
                />
                <CommonButton text={'제출하기'} clickEvent={handleMoveToWaiting} />
                <CommonButton text={'나가기'} clickEvent={handleMoveToResult} />
            </ContentBox>
        </>
    );
};

export default QuizZonePage;
