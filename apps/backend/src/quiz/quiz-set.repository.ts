import { DataSource, Repository } from 'typeorm';
import { QuizSet } from './quiz-set.entity';
import { Injectable } from '@nestjs/common';
import { Quiz } from './quiz.entitiy';

@Injectable()
export class QuizSetRepository extends Repository<QuizSet> {
    constructor(dataSource: DataSource) {
        super(QuizSet, dataSource.manager);
    }

    findOneById(quizSetId: number) {
        return this.findOneBy({ id: quizSetId });
    }
}
