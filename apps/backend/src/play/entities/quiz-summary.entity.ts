import { Rank } from './rank.entity';

export interface QuizSummary {
    readonly ranks: Rank[];
    readonly endSocketTime?: number;
}