import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './quiz.entitiy';
import { QuizSet } from './quiz-set.entity';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizRepository } from './quiz.repository';
import { DataSource } from 'typeorm';
import { QuizSetRepository } from './quiz-set.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Quiz, QuizSet])],
    controllers: [QuizController],
    providers: [QuizService, QuizRepository, QuizSetRepository],
})
export class QuizModule {}
