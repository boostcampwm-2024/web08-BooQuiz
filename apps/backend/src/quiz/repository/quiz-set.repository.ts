import { DataSource, Repository } from 'typeorm';
import { QuizSet } from '../entity/quiz-set.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizSetRepository extends Repository<QuizSet> {
    constructor(dataSource: DataSource) {
        super(QuizSet, dataSource.manager);
    }

    findOneById(quizSetId: number) {
        return this.findOneBy({ id: quizSetId });
    }
}
