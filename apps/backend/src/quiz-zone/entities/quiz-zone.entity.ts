import { Quiz } from './quiz.entity';
import { Player } from './player.entity';
/**
* 퀴즈 게임을 진행하는 공간을 나타내는 퀴즈존 인터페이스
* 
* @property players 플레이어 목록
* @property adminId 퀴즈 존을 생성한 관리자 ID
* @property maxPlayers 퀴즈 존의 최대 플레이어 수
* @property quizzes 퀴즈 목록
* @property stage 퀴즈 존의 현재 상태 
* @property title 퀴즈 세트의 제목
* @property description 퀴즈 세트의 설명
* @property currentQuizIndex 현재 출제 중인 퀴즈의 인덱스
* @property currentQuizStartTime 현재 퀴즈의 출제 시작 시간
* @property currentQuizDeadlineTime 현재 퀴즈의 제출 마감 시간
* @property intervalTime 퀴즈 간의 간격 시간
*/
export interface QuizZone {
    players: Map<string, Player>;
    adminId: string;
    maxPlayers: number;
    quizzes: Quiz[];
    stage: 'LOBBY' | 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'RESULT';
    title: string;
    description: string;
    currentQuizIndex: number;
    currentQuizStartTime: number;
    currentQuizDeadlineTime: number;
    intervalTime: number;
}
