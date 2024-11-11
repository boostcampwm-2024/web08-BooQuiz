export interface CurrentQuizDto {
    readonly question: string;
    readonly stage: 'LOBBY' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'RESULT';
    readonly currentIndex: number;
    readonly startTime: number;
    readonly deadlineTime: number;
}
