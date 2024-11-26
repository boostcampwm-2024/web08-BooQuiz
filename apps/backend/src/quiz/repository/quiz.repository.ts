import { Quiz } from '../entity/quiz.entitiy';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class QuizRepository extends Repository<Quiz> {
    constructor(dataSource: DataSource) {
        super(Quiz, dataSource.manager);
    }
}
