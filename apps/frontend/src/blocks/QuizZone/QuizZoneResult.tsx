import CommonButton from '@/components/common/CommonButton';
import ContentBox from '@/components/common/ContentBox';
import Typography from '@/components/common/Typogrpahy';
import { useNavigate } from 'react-router-dom';

interface QuizZoneResultProps {
    quizZoneData: any;
}

const QuizZoneResult = ({ quizZoneData }: QuizZoneResultProps) => {
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
                    size="2xl"
                    color="blue"
                    text={`최종 점수: ${quizZoneData.result.score}`}
                    bold={true}
                />
                {/* {quizZoneData.result.quizzes ??
                    quizZoneData.result.quizzes.map((quiz, index) => (
                        <Typography
                            size="base"
                            color="blue"
                            text={`Q. ${quiz.question} / A. ${quiz.answer} / ${quiz.playTime}`}
                            bold={true}
                        />
                    ))}
                {quizZoneData.result.submits ??
                    quizZoneData.result.submits.map((submit, index) => (
                        <Typography
                            size="base"
                            color="blue"
                            text={`제출 ${index + 1}: ${submit.answer ?? '빈 값 혹은 제출하지 않았습니다.'}, 제출 시간: ${submit.submittedAt}, 수신 시간: ${submit.receivedAt}`}
                            bold={true}
                        />
                    ))} */}
                <CommonButton text="메인으로" clickEvent={handleMoveToMain} />
            </ContentBox>
        </div>
    );
};

export default QuizZoneResult;
