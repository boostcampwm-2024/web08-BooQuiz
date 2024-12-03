import ContentBox from '@/components/common/ContentBox.tsx';
import { ChangeEvent, useMemo } from 'react';
import SearchQuizSet from '@/blocks/CreateQuizZone/SearchQuizSet.tsx';
import { useNavigate } from 'react-router-dom';
import { requestCreateQuizZone } from '@/utils/requests.ts';
import {
    CreateQuizZone,
    CreateQuizZoneReducerActions,
    CreateQuizZoneStage,
    ResponseQuizSet,
} from '@/types/create-quiz-zone.types.ts';
import Typography from '@/components/common/Typogrpahy';
import Input from '@/components/common/Input';
import CommonButton from '@/components/common/CommonButton';
import {
    validateQuizZoneSetCode,
    validateQuizZoneSetDescription,
    validateQuizZoneSetLimit,
    validateQuizZoneSetName,
} from '@/utils/validators';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface CreateQuizZoneBasicProps {
    quizZone: CreateQuizZone;
    updateQuizZoneBasic: (value: string, type: CreateQuizZoneReducerActions) => void;
    moveStage: (stage: CreateQuizZoneStage) => void;
}

const CreateQuizZoneBasic = ({
    quizZone,
    updateQuizZoneBasic,
    moveStage,
}: CreateQuizZoneBasicProps) => {
    const { quizZoneId, title, description, limitPlayerCount, quizSetName } = quizZone;
    const navigate = useNavigate();

    const handleChangeQuizZoneBasic = (
        event: ChangeEvent<HTMLInputElement>,
        type: CreateQuizZoneReducerActions,
    ) => {
        const value = event.target.value ?? '';
        updateQuizZoneBasic(value, type);
    };

    const selectQuizSet = (quizSet: ResponseQuizSet) => {
        updateQuizZoneBasic(quizSet.id, 'QUIZ_SET_ID');
        updateQuizZoneBasic(quizSet.name, 'QUIZ_SET_NAME');
    };

    const createQuizZone = async () => {
        try {
            await requestCreateQuizZone(quizZone);
            navigate(`/${quizZoneId}`);
        } catch (error) {
            console.error(error);
        }
    };

    // 유효성 검사 결과를 메모이제이션
    const validationError = useMemo(() => {
        return (
            validateQuizZoneSetCode(quizZoneId) ||
            validateQuizZoneSetName(title) ||
            validateQuizZoneSetDescription(description) ||
            validateQuizZoneSetLimit(limitPlayerCount)
        );
    }, [title, description, quizZoneId, limitPlayerCount]);

    return (
        <div className="sm:max-w-sm max-w-md w-full flex flex-col gap-2">
            <ContentBox className="gap-2 w-full bg-white shadow-md">
                <Typography text="퀴즈존 기본 정보" size="2xl" color="black" bold={true} />
                <div className="flex flex-row gap-2 w-full">
                    <Input
                        type="text"
                        name="quiz-zone-id"
                        label="입장 코드"
                        value={quizZoneId}
                        onChange={(e) => handleChangeQuizZoneBasic(e, 'QUIZ_ZONE_ID')}
                        isBorder={true}
                        className="rounded-md w-full"
                        placeholder="퀴즈존 코드를 입력하세요"
                        error={
                            validationError == '5자 이상 입력해주세요.' ||
                            validationError == '10자 이하로 입력해주세요.'
                                ? validationError
                                : ''
                        }
                        isShowCount={true}
                        max={10}
                    />
                    <Input
                        type="number"
                        label="최대 인원"
                        name="quiz-zone-limit-player-count"
                        step={10}
                        min={1}
                        max={300}
                        value={limitPlayerCount}
                        onChange={(e) => handleChangeQuizZoneBasic(e, 'LIMIT')}
                        isBorder={true}
                        className="w-20"
                    />
                </div>
                <Input
                    label="퀴즈존 제목"
                    type="text"
                    name="quiz-zone-title"
                    value={title}
                    onChange={(e) => handleChangeQuizZoneBasic(e, 'TITLE')}
                    isBorder={true}
                    placeholder="퀴즈존 제목을 입력하세요"
                    error={
                        validationError == '100자 이하로 입력해주세요.' ||
                        validationError == '제목을 입력해주세요.'
                            ? validationError
                            : ''
                    }
                    isShowCount={true}
                    max={100}
                />

                <Input
                    label="퀴즈존 설명"
                    type="text"
                    name="quiz-zone-description"
                    value={description}
                    onChange={(e) => handleChangeQuizZoneBasic(e, 'DESC')}
                    isBorder={true}
                    placeholder="퀴즈존 설명을 입력하세요"
                    error={validationError == '500자 이하로 입력해주세요.' ? validationError : ''}
                    isShowCount={true}
                    max={500}
                />
            </ContentBox>
            <ContentBox className="gap-2 w-full bg-white shadow-md">
                <div className="w-full flex flex-row justify-between items-center">
                    <Typography text="퀴즈셋" size="2xl" color="black" bold={true} />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveStage('QUIZ_SET')}
                        className="rounded-full hover:bg-primary/10"
                    >
                        <Plus className="h-5 w-5" />
                    </Button>
                </div>
                <div className="">
                    <div>
                        <Typography
                            text="퀴즈존을 만들거나 선택해주세요"
                            color="gray"
                            size="base"
                        />
                        {/* <span>선택된 퀴즈셋</span> */}
                        <Input
                            // label="퀴즈셋"
                            type="text"
                            name="quiz-zone-description"
                            value={quizSetName}
                            onChange={() => {}}
                            isBorder={true}
                            placeholder="선택된 퀴즈셋이 없습니다."
                            disabled={true}
                            className="text-lg"
                        />
                    </div>
                </div>
                {/* 퀴즈셋을 선택하시거나 만들어주세요 */}
                <SearchQuizSet selectQuizSet={selectQuizSet} />
            </ContentBox>
            <CommonButton
                className="min-w-10 "
                clickEvent={() => createQuizZone()}
                disabled={!!validationError}
            >
                퀴즈존 만들기
            </CommonButton>
        </div>
    );
};

export default CreateQuizZoneBasic;
