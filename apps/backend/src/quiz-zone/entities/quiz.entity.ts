/**
 * 퀴즈 엔티티
 * 
 * @property question: 퀴즈의 질문
 * @property answer: 퀴즈의 정답
 * @property playTime: 퀴즈의 플레이 시간
 */
export interface Quiz {
    question: string;
    answer: string;
    playTime: number;
}
