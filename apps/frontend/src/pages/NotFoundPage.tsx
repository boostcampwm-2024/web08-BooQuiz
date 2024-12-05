import CommonButton from '@/components/common/CommonButton';
import ContentBox from '@/components/common/ContentBox';
import Typography from '@/components/common/Typogrpahy';
import TooltipWrapper from '@/components/common/TooltipWrapper';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/common/Logo';

const NotFound = () => {
    const navigate = useNavigate();
    const handleMoveMainPage = () => {
        navigate(`/`);
    };

    return (
        <div className="flex flex-col justify-center items-center gap-4 min-h-[calc(100vh-4rem)]">
            <TooltipWrapper content="BooQuiz - 실시간 퀴즈 플랫폼">
                <Logo color="#2563eb" className="lg:max-h-40 w-full" />
            </TooltipWrapper>

            <Typography
                size="2xl"
                color="blue"
                text="실시간 퀴즈 플랫폼 BooQuiz에 오신 것을 환영합니다!"
                bold={true}
            />

            <ContentBox className="w-full md:w-[48rem] gap-2 bg-white shadow-lg">
                <Typography
                    size="base"
                    color="gray"
                    text="해당 페이지는 존재하지 않는 페이지 입니다."
                />

                <TooltipWrapper
                    content="새로운 퀴즈존을 생성합니다"
                    side="bottom"
                    className="w-full"
                >
                    <CommonButton
                        text="메인 페이지로 이동"
                        clickEvent={handleMoveMainPage}
                        className="w-full"
                    />
                </TooltipWrapper>
            </ContentBox>
        </div>
    );
};

export default NotFound;
