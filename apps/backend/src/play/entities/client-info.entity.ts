import { WebSocket } from 'ws';
/**
 * 퀴즈 클라이언트의 정보를 나타냅니다.
 *
 * @property quizZoneId - 클라이언트가 참여한 퀴즈존 ID
 * @property socket - 클라이언트의 WebSocket 연결
 */
export interface ClientInfo {
    quizZoneId: string;
    socket: WebSocket;
}