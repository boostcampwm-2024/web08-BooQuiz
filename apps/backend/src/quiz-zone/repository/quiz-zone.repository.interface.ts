import { QuizZone } from '../entities/quiz-zone.entity';

export interface IQuizZoneRepository {
    get(key: string): Promise<QuizZone>;
    set(key: string, value: QuizZone): Promise<void>;
}
