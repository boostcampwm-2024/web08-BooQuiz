import { QuizZone } from '../entities/quiz-zone.entity';

/**
 * 퀴즈 존 저장소를 위한 인터페이스입니다.
 *
 * 이 인터페이스는 퀴즈 존 데이터를 저장, 조회, 삭제하는 메서드를 정의합니다.
 */
export interface IQuizZoneRepository {
    /**
     * 주어진 키에 해당하는 퀴즈 존을 반환합니다.
     *
     * @param key - 조회할 퀴즈 존의 키
     * @returns 퀴즈 존 객체
     */
    get(key: string): Promise<QuizZone | null>;

    /**
     * 주어진 키에 퀴즈 존을 저장합니다.
     *
     * @param key - 퀴즈 존을 저장할 키
     * @param value - 저장할 퀴즈 존 객체
     * @returns 저장 작업 완료
     */
    set(key: string, value: QuizZone): Promise<void>;

    /**
     * 주어진 키에 해당하는 퀴즈 존을 삭제합니다.
     *
     * @param key - 삭제할 퀴즈 존의 키
     * @returns 삭제 작업 완료
     */
    delete(key: string): Promise<void>;

    /**
     * 주어진 키에 해당하는 퀴즈존이 존재하는지 확인합니다.
     *
     * @param key - 존재 여부를 확인할 퀴즈존의 키
     * @returns 존재 여부
     */
    has(key: string): Promise<boolean>;
}
