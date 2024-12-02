import CommonButton from '@/components/common/CommonButton';
import ContentBox from '@/components/common/ContentBox';
import Input from '@/components/common/Input';
import Typography from '@/components/common/Typogrpahy';
import TooltipWrapper from '@/components/common/TooltipWrapper';
import { AsyncBoundary } from '@/components/boundary/AsyncBoundary';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsyncError } from '@/hook/useAsyncError';
import { ValidationError } from '@/types/error.types';
import Logo from '@/components/common/Logo';

const MainPageContent = () => {
    const [input, setInput] = useState('');
    const navigate = useNavigate();
    const throwError = useAsyncError();

    const validateInput = (input: string) => {
        if (!input) {
            throw new ValidationError('퀴즈존 코드를 입력해주세요');
        }
        if (input.length < 5 || input.length > 10) {
            throw new ValidationError('퀴즈존 코드를 입력해주세요');
        }
    };

    const handleCreateQuizZone = async () => {
        try {
            navigate(`/quiz-zone`);
        } catch (error) {
            throwError(error);
        }
    };

    const handleMoveToQuizZoneLobby = async () => {
        try {
            validateInput(input);
            const response = await fetch(`/api/quiz-zone/${input}`, { method: 'GET' });
            if (!response.ok) {
                throwError(response);
                return;
            }
            navigate(`/${input}`);
        } catch (error) {
            throwError(error);
        }
    };

    return (
        <div className="flex flex-col justify-center items-center gap-4 min-h-[calc(100vh-4rem)]">
            <TooltipWrapper content="BooQuiz - 실시간 퀴즈 플랫폼">
                <Logo color="#2563eb" className="max-h-40" />
            </TooltipWrapper>

            <Typography
                size="2xl"
                color="blue"
                text="실시간 퀴즈 플랫폼 BooQuiz에 오신 것을 환영합니다!"
                bold={true}
            />

            <ContentBox className="w-4/5 md:w-[48rem] gap-2">
                <Typography size="xl" color="blue" text="퀴즈 참여하기" bold={true} />

                <TooltipWrapper
                    content="퀴즈존 코드를 입력해주세요"
                    side="bottom"
                    className="w-full"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        name="입장코드"
                        isAutoFocus={false}
                        placeholder="입장 코드를 5자리에서 10자리 까지 작성해주세요(예:1A2B3C)"
                        isBorder={true}
                        height="h-14"
                    />
                </TooltipWrapper>

                <Typography
                    size="xs"
                    color="gray"
                    text="버튼을 눌러 퀴즈존에 참여해보세요"
                    bold={true}
                />

                <TooltipWrapper
                    content="입력한 퀴즈존 코드로 이동합니다"
                    side="bottom"
                    className="w-full"
                >
                    <CommonButton
                        text="퀴즈존 참여하기"
                        isFilled={true}
                        clickEvent={handleMoveToQuizZoneLobby}
                        className="w-full"
                    />
                </TooltipWrapper>

                <TooltipWrapper
                    content="새로운 퀴즈존을 생성합니다"
                    side="bottom"
                    className="w-full"
                >
                    <CommonButton
                        text="퀴즈존 생성하기"
                        clickEvent={handleCreateQuizZone}
                        className="w-full"
                    />
                </TooltipWrapper>
            </ContentBox>
        </div>
    );
};

const MainPage = () => {
    const navigate = useNavigate();

    return (
        <AsyncBoundary
            pending={
                <div className="flex h-screen items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
                </div>
            }
            handleError={(error: any) => {
                console.error('Main Page Error:', error);
            }}
            onReset={() => navigate('/')}
        >
            <MainPageContent />
        </AsyncBoundary>
    );
};

export default MainPage;
