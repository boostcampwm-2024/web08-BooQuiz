import CreateQuizZoneBasic from '@/blocks/CreateQuizZone/CreateQuizZoneBasic.tsx';
import CreateQuizSet from '@/blocks/CreateQuizZone/CreateQuizSet.tsx';
import { useReducer, useState } from 'react';

export type CreateQuizZoneStage = 'QUIZ_ZONE' | 'QUIZ_SET' | 'SUMMARY';

export interface CreateQuizZone {
    quizZoneId: string;
    title: string;
    description: string;
    limitPlayerCount: number;
    quizSetId: string;
    quizSetName: string;
}

export type CreateQuizZoneReducerActions =
    | 'QUIZ_ZONE_ID'
    | 'TITLE'
    | 'DESC'
    | 'LIMIT'
    | 'QUIZ_SET_ID'
    | 'QUIZ_SET_NAME';

export type CreateQuizZoneReducerAction = { type: CreateQuizZoneReducerActions; payload: string };

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
        <>
            <h2>퀴즈존 개설하기</h2>
            {getCreateQuizZoneStageBlock(stage)}
        </>
    );
};

export default CreateQuizZonePage;
