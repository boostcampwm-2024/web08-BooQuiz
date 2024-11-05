import { QuizZone } from './entities/quiz-zone.entity';

export interface QuizZoneRepositoryInterface {
  set(key: string, value: QuizZone): Promise<void>;
}