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
import CustomAlertDialogContent from '@/components/common/CustomAlertDialogContent.tsx';
import { AlertDialog } from '@radix-ui/react-alert-dialog';

const MainPageContent = () => {
    const [input, setInput] = useState('');
    const [alertIsOpen, setAlertIsOpen] = useState(false);
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

    const handleClickJoin = async () => {
        try {
            validateInput(input);

            const isEntered = await requestCheckEnteredQuizZone(input);

            if (isEntered) {
                moveQuizZoneLobby(input);
            } else {
                setAlertIsOpen(true);
            }
        } catch (e) {
            throwError(e);
        }
    };

    const requestCheckEnteredQuizZone = async (enterCode: string) => {
        const response = await fetch(`/api/quiz-zone/check/${enterCode}`);

        if (!response.ok) {
            throw throwError(response);
        }

        return (await response.json()) as boolean;
    };

    const moveQuizZoneLobby = (enterCode: string) => {
        navigate(`/${enterCode}`);
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
                    size="xs"
                    color="gray"
                    text="퀴즈존 코드를 입력하거나 생성하여 퀴즈를 즐겨보세요!"
                />
                <div className="w-full flex flex-row gap-2">
                    <TooltipWrapper
                        content="영어 대소문자, 숫자 5~10자리로 구성된 코드를 입력해주세요"
                        side="bottom"
                        className="w-full"
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            name="입장코드"
                            isAutoFocus={false}
                            placeholder="입장 코드를 작성해주세요"
                            height="h-10 sm:h-12"
                            isBorder={true}
                            className="mb-4 w-full"
                        />
                    </TooltipWrapper>
                    <TooltipWrapper
                        content="입력한 퀴즈존 코드로 이동합니다"
                        side="bottom"
                        className="max-w-24 w-full"
                    >
                        <CommonButton
                            text="참여하기"
                            isFilled={true}
                            clickEvent={handleClickJoin}
                            className="w-full h-10 sm:h-12"
                        />
                    </TooltipWrapper>
                </div>
                <hr className="w-full border-t border-gray-300 my-1" />
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
            <AlertDialog open={alertIsOpen}>
                <CustomAlertDialogContent
                    title={'퀴즈존 입장'}
                    description={
                        '이미 참여중인 퀴즈존이 있습니다. 새로운 퀴즈존에 입장하시겠습니까?'
                    }
                    type={'warning'}
                    confirmText={'입장하기'}
                    cancelText={'취소'}
                    handleCancel={() => setAlertIsOpen(false)}
                    handleConfirm={() => moveQuizZoneLobby(input)}
                />
            </AlertDialog>
        </div>
    );
};

const MainPage = () => {
    const navigate = useNavigate();

    return (
        <AsyncBoundary
            pending={
                <div className="flex h-screen items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2563eb]" />
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
