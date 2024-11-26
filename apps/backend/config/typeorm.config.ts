import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Quiz } from '../src/quiz/entity/quiz.entitiy';
import { QuizSet } from '../src/quiz/entity/quiz-set.entity';
import { ConfigService } from '@nestjs/config';

// @Injectable()
export class TypeormConfig implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mysql',
            host: this.configService.get<string>('host'),
            port: this.configService.get<number>('db_port'),
            username: this.configService.get<string>('db_username'),
            password: this.configService.get<string>('db_password'),
            database: this.configService.get<string>('db_database'),
            entities: [Quiz, QuizSet],
            synchronize: this.configService.get<boolean>('db_synchronize', true),
            logging: ['query'],
        };
    }
}
