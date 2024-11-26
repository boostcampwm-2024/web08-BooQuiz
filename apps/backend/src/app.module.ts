import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizZoneModule } from './quiz-zone/quiz-zone.module';
import { PlayModule } from './play/play.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import httpConfig from '../config/http.config';
import { APP_PIPE } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/winston.config';
import { HttpLoggingMiddleware } from './logger/http-logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizModule } from './quiz/quiz.module';
import databaseConfig from '../config/database.config';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { TypeormConfig } from '../config/typeorm.config';

@Module({
    imports: [
        QuizZoneModule,
        PlayModule,
        ConfigModule.forRoot({
            load: [httpConfig, databaseConfig],
            isGlobal: true,
        }),
        WinstonModule.forRoot(winstonConfig),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useClass: TypeormConfig,
            dataSourceFactory: async (options) => {
                const dataSource = new DataSource(options);
                await dataSource.initialize();
                return addTransactionalDataSource(dataSource);
            },
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
