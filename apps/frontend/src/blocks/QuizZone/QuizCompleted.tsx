import ContentBox from '@/components/common/ContentBox';
import Typography from '@/components/common/Typogrpahy';

interface QuizCompletedProps {
    isLastQuiz: boolean;
}

const QuizCompleted = ({ isLastQuiz }: QuizCompletedProps) => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <img width="200px" src="/BooQuizLogo.png" alt="BooQuiz Logo" />
            <ContentBox>
                <div className="w-full flex flex-col items-center gap-2">
                    <Typography
                        size="3xl"
                        color="blue"
                        text={isLastQuiz ? '결과를 산출 중입니다.' : '다음 퀴즈를 준비 중입니다.'}
                        bold={true}
                    />
                    <Typography size="3xl" color="blue" text="잠시만 기다려주세요" bold={true} />
                </div>
            </ContentBox>
        </div>
    );
};

export default QuizCompleted;
