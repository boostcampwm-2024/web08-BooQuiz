import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Quiz } from './quiz.entitiy';

@Entity()
export class QuizSet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 50})
    name: string;

    @OneToMany((type) => Quiz, (quiz) => quiz.quizSet)
    quizzes?: Quiz[];

    constructor(name: string) {
        this.name = name;
    }
}
