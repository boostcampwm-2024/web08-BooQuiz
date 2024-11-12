export interface WaitingQuizZoneDto {
    quizCount: number;
    stage: 'LOBBY' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'RESULT';
}
