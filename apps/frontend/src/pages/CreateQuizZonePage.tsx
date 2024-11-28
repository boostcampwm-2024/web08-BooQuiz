import CreateQuizZoneBasic from '@/blocks/CreateQuizZone/CreateQuizZoneBasic.tsx';
import CreateQuizSet from '@/blocks/CreateQuizZone/CreateQuizSet.tsx';
import { useReducer, useState } from 'react';
import {
    CreateQuizZone,
    CreateQuizZoneReducerAction,
    CreateQuizZoneReducerActions,
    CreateQuizZoneStage,
} from '@/types/create-quiz-zone.types.ts';
import Typography from '@/components/common/Typogrpahy';

const CreateQuizZoneReducer = (state: CreateQuizZone, action: CreateQuizZoneReducerAction) => {
    const { type, payload } = action;

    switch (type) {
        case 'QUIZ_ZONE_ID':
            return { ...state, quizZoneId: payload };
        case 'TITLE':
            return { ...state, title: payload };
        case 'DESC':
            return { ...state, description: payload };
        case 'LIMIT':
            return { ...state, limitPlayerCount: parseInt(payload) };
        case 'QUIZ_SET_ID':
            return { ...state, quizSetId: payload };
        case 'QUIZ_SET_NAME':
            return { ...state, quizSetName: payload };
    }
};

const CreateQuizZonePage = () => {
    const [stage, setState] = useState<CreateQuizZoneStage>('QUIZ_ZONE');
    const [quizZone, dispatch] = useReducer(CreateQuizZoneReducer, {
        quizZoneId: '',
        title: '',
        description: '',
        limitPlayerCount: 10,
        quizSetId: '',
        quizSetName: '',
    });

    const moveStage = (stage: CreateQuizZoneStage) => {
        setState(stage);
    };

    const updateQuizZoneBasic = (payload: string, type: CreateQuizZoneReducerActions) => {
        dispatch({ type, payload });
    };

    const updateQuizSet = (quizSetId: string, quizSetName: string) => {
        updateQuizZoneBasic(quizSetId, 'QUIZ_SET_ID');
        updateQuizZoneBasic(quizSetName, 'QUIZ_SET_NAME');
    };

    const getCreateQuizZoneStageBlock = (stage: CreateQuizZoneStage) => {
        switch (stage) {
            case 'QUIZ_ZONE':
                return (
                    <CreateQuizZoneBasic
                        quizZone={quizZone}
                        updateQuizZoneBasic={updateQuizZoneBasic}
                        moveStage={moveStage}
                    />
                );
            case 'QUIZ_SET':
                return (
                    <CreateQuizSet
                        handlePrevStepButton={() => moveStage('QUIZ_ZONE')}
                        updateQuizSet={updateQuizSet}
                    />
                );
        }
    };

    return (
        <div className="flex flex-col justify-center items-center gap-4 min-h-[calc(100vh+2rem)] mt-16">
            <Typography text="퀴즈존 생성하기" size="3xl" color="blue" bold={true} />
            {getCreateQuizZoneStageBlock(stage)}
        </div>
    );
};

export default CreateQuizZonePage;
