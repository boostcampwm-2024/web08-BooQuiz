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

export interface ResponseQuizSet {
    id: string;
    name: string;
}

export interface ResponseSearchQuizSets {
    quizSetDetails: ResponseQuizSet[];
    currentPage: number;
    total: number;
}
