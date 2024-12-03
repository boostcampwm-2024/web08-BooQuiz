/**
 * 사용자가 보낸 채팅 메시지를 나타내는 엔티티
 *
 * @property clientId - 클라이언트 ID
 * @property nickname - 클라이언트의 닉네임
 * @property message - 채팅 메시지
 */

export interface ChatMessage {
    clientId: string;
    nickname: string;
    message: string;
}
