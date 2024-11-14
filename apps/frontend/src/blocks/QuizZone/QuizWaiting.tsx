import ContentBox from '@/components/common/ContentBox';
import Typography from '@/components/common/Typogrpahy';

interface QuizWaitingProps {
    prepareTime: number | null;
}

const QuizWaiting = ({ prepareTime }: QuizWaitingProps) => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center gap-4">
            <img width="200px" src="/BooQuizLogo.png" alt="BooQuiz Logo" />
            <ContentBox className="w-4/5 md:w-[48rem] gap-8 flex flex-col items-center box-border">
                <div className="w-full flex flex-col items-center gap-2">
                    <Typography
                        size="2xl"
                        color="gray"
                        text="다음 퀴즈를 준비 중입니다."
                        bold={true}
                    />
                    <Typography size="2xl" color="gray" text="잠시만 기다려주세요" bold={true} />
                </div>

                {prepareTime !== null && (
                    <div className="w-full flex flex-row justify-center items-end">
                        <Typography
                            size="3xl"
                            color="blue"
                            text={`${prepareTime.toFixed(1)}`}
                            bold={true}
                        />
                        <Typography size="base" color="blue" text={` 초 뒤에 시작`} bold={true} />
                    </div>
                )}
            </ContentBox>
        </div>
    );
};

export default QuizWaiting;
