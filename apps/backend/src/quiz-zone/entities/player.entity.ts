import { SubmittedQuiz } from './submitted.quiz';

export interface Player {
  id: string;
  score: number;
  submits: SubmittedQuiz[];
  state: 'WAIT' | 'PLAY' | 'SUBMIT';
}