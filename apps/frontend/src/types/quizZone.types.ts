export type QuizZoneStage = 'LOBBY' | 'IN_PROGRESS' | 'RESULT';
export type PlayerState = 'WAIT' | 'PLAY' | 'SUBMIT';
export type ProblemType = 'SHORT';

export interface Player {
    id: string;
    nickname: string;
    state?: PlayerState;
}

export interface QuizZone {
    stage: QuizZoneStage;
    currentPlayer: Player;
    title: string;
    description: string;
    hostId: string;
    quizCount: number;
    players?: Player[];
    currentQuiz?: CurrentQuiz;
    score?: number;
    quizzes?: Quiz[];
    submits?: SubmittedQuiz[];
    isLastQuiz?: boolean;
}

export interface QuizZoneLobbyState {
    stage: QuizZoneStage;
    title: string;
    description: string;
    quizCount: number;
    hostId: string;
    players: Player[];
    currentPlayer: Player;
}

export interface CurrentQuiz {
    question: string;
    currentIndex: number;
    playTime: number;
    startTime: number;
    deadlineTime: number;
    type?: ProblemType;
}

export interface QuizZoneProgressState {
    currentPlayer: Player;
    currentQuiz: CurrentQuiz;
}

export interface Quiz {
    question: string;
    answer: string;
    playTime: number;
}

export interface SubmittedQuiz {
    index: number;
    answer: string;
    submittedAt: number;
    receivedAt: number;
}

export interface QuizZoneResultState {
    score: number;
    submits: SubmittedQuiz[];
    quizzes: Quiz[];
}