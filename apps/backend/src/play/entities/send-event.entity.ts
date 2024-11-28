/**
 * 웹소켓 서버가 사용자에게 응답할 메시지 형식을 정의합니다.
 * 
 * @property event - 클라이언트에게 전송할 이벤트 이름
 * @property data - 클라이언트에게 전송할 데이터
 */
export interface SendEventMessage<T> {
    event: string;
    data: T;
}