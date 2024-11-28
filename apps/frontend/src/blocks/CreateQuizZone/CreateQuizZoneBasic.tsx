import ContentBox from '@/components/common/ContentBox.tsx';
import { ChangeEvent } from 'react';
import SearchQuizSet from '@/blocks/CreateQuizZone/SearchQuizSet.tsx';
import { useNavigate } from 'react-router-dom';
import { requestCreateQuizZone } from '@/utils/requests.ts';
import {
    CreateQuizZone,
    CreateQuizZoneReducerActions,
    CreateQuizZoneStage,
    ResponseQuizSet,
} from '@/types/create-quiz-zone.types.ts';

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

    return (
        <ContentBox>
            <h3 className="">퀴즈존 기본 정보</h3>
            <div className="">
                <div className="">
                    <label htmlFor="quiz-zone-id" className="">
                        입장 코드
                    </label>
                    <input
                        type="text"
                        id="quiz-zone-id"
                        value={quizZoneId}
                        onChange={(e) => handleChangeQuizZoneBasic(e, 'QUIZ_ZONE_ID')}
                    />
                </div>
                <div className="">
                    <label htmlFor="quiz-zone-limit-player-count" className="block">
                        최대 인원
                    </label>
                    <input
                        type="number"
                        id="quiz-zone-limit-player-count"
                        step="10"
                        min={1}
                        max={300}
                        value={limitPlayerCount}
                        onChange={(e) => handleChangeQuizZoneBasic(e, 'LIMIT')}
                    />
                </div>
                <div className="">
                    <label htmlFor="quiz-zone-title" className="block">
                        제목
                    </label>
                    <input
                        type="text"
                        id="quiz-zone-title"
                        value={title}
                        onChange={(e) => handleChangeQuizZoneBasic(e, 'TITLE')}
                    />
                </div>
                <div className="">
                    <label htmlFor="quiz-zone-description" className="block">
                        요약
                    </label>
                    <input
                        type="text"
                        id="quiz-zone-description"
                        value={description}
                        onChange={(e) => handleChangeQuizZoneBasic(e, 'DESC')}
                    />
                </div>
                <div className="">
                    <div>
                        <span>선택된 퀴즈셋</span>
                        <div>{quizSetName}</div>
                    </div>
                </div>
                <button
                    type={'button'}
                    onClick={() => {
                        moveStage('QUIZ_SET');
                    }}
                >
                    퀴즈셋 만들기
                </button>
                <SearchQuizSet selectQuizSet={selectQuizSet} />
            </div>
            <button onClick={() => createQuizZone()}>퀴즈존 만들기</button>
        </ContentBox>
    );
};

export default CreateQuizZoneBasic;
