/**
 * 플레이어가 제출한 퀴즈 엔티티
 *
 * @property index: 퀴즈의 인덱스
 * @property answer: 플레이어가 제출한 답
 * @property submittedAt: 플레이어가 제출한 시각
 * @property receivedAt: 플레이어가 제출한 시각
 */
export interface SubmittedQuiz {
    index: number;
    answer?: string;
    submittedAt?: number;
    receivedAt?: number;
    submitRank?: number;
}
