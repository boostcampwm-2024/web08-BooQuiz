import { DataSource, ILike, Repository } from 'typeorm';
import { QuizSet } from '../entity/quiz-set.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizSetRepository extends Repository<QuizSet> {
    constructor(dataSource: DataSource) {
        super(QuizSet, dataSource.manager);
    }

    searchByName(name: string, page: number, pageSize: number) {
        return this.find({
                where: {name: ILike(`${name}%`)},
                order: {recommended: 'DESC', createAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
        });
    }

    countByName(name: string) {
        return this.count({ where: { name: ILike(`${name}%`) } });
    }
}
