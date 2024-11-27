import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuizSet } from './quiz-set.entity';
import { QUIZ_TYPE } from '../../common/constants';

/**
 * 퀴즈 엔티티
 *
 * @property question: 퀴즈의 질문
 * @property answer: 퀴즈의 정답
 * @property playTime: 퀴즈의 플레이 시간
 */
@Entity()
export class Quiz {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 255})
    question: string;

    @Column({type: 'varchar', length: 50})
    answer: string;

    @Column({ type: 'int' })
    playTime: number;

    @Column({ name: 'quiz_type', type: 'varchar', length: 20 })
    quizType: QUIZ_TYPE;

    @ManyToOne((type) => QuizSet, (quizSet) => quizSet.quizzes, {
        onDelete: 'CASCADE',
    })
    quizSet: QuizSet;

    constructor(
        question: string,
        answer: string,
        playTime: number,
        quizType: QUIZ_TYPE,
        quizSet: QuizSet,
    ) {
        this.question = question;
        this.answer = answer;
        this.playTime = playTime;
        this.quizType = quizType;
        this.quizSet = quizSet;
    }
}
