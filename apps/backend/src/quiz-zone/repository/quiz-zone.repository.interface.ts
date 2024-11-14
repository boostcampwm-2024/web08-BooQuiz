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
     * @throws {NotFoundException} 해당 키로 저장된 퀴즈 존이 없을 경우 예외 발생
     */
    get(key: string): Promise<QuizZone>;

    /**
     * 주어진 키에 퀴즈 존을 저장합니다.
     *
     * @param key - 퀴즈 존을 저장할 키
     * @param value - 저장할 퀴즈 존 객체
     * @returns 저장 작업 완료
     * @throws {ConflictException} 해당 키로 이미 데이터가 존재할 경우 예외 발생
     */
    set(key: string, value: QuizZone): Promise<void>;

    /**
     * 주어진 키에 해당하는 퀴즈 존을 삭제합니다.
     *
     * @param key - 삭제할 퀴즈 존의 키
     * @returns 삭제 작업 완료
     * @throws {NotFoundException} 해당 키로 저장된 퀴즈 존이 없을 경우 예외 발생
     */
    delete(key: string): Promise<void>;
}
