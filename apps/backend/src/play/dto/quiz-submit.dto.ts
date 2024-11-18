/**
 * 클라이언트의 퀴즈 제출을 위한 DTO
 * @property index - 퀴즈의 인덱스
 * @property answer - 플레이어가 제출한 답
 * @property submittedAt - 플레이어가 정답을 제출한 시각
 */
export interface QuizSubmitDto {
    index: number;
    answer: string;
    submittedAt: number;
}
