import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Quiz } from './quiz.entitiy';

@Entity()
export class QuizSet {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany((type) => Quiz, (quiz) => quiz.quizSet)
    quizzes?: Quiz[];

    constructor(name: string) {
        this.name = name;
    }
}
