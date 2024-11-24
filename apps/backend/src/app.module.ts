import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizZoneModule } from './quiz-zone/quiz-zone.module';
import { PlayModule } from './play/play.module';
import { ConfigModule } from '@nestjs/config';
import httpConfig from '../config/http.config';
import { APP_PIPE } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/winston.config';
import { HttpLoggingMiddleware } from './logger/http-logger.middleware';
import { Quiz } from './quiz/quiz.entitiy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizSet } from './quiz/quiz-set.entity';
import { QuizModule } from './quiz/quiz.module';

@Module({
    imports: [
        QuizZoneModule,
        PlayModule,
        ConfigModule.forRoot({
            load: [httpConfig],
        }),
        WinstonModule.forRoot(winstonConfig),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'booquiz',
            entities: [Quiz, QuizSet],
            synchronize: true,
            logging: ['query'],
        }),
        QuizModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(HttpLoggingMiddleware).forRoutes('*');
    }
}
