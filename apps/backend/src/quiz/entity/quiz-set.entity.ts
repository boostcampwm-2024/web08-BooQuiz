import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Quiz } from './quiz.entitiy';
import { BaseEntity } from '../../common/base-entity';

@Entity('quiz_set')
export class QuizSet extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'boolean', default: false })
    recommended: boolean;

    @OneToMany((type) => Quiz, (quiz) => quiz.quizSet)
    quizzes?: Quiz[];

    constructor(name: string, recommended: boolean = false) {
        super();
        this.name = name;
        this.recommended = recommended;
    }
}
