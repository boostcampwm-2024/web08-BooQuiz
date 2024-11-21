import { MiddlewareConsumer, Module, NestModule,ValidationPipe } from '@nestjs/common';
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

@Module({
    imports: [
        QuizZoneModule,
        PlayModule,
        ConfigModule.forRoot({
            load: [httpConfig],
        }),
        WinstonModule.forRoot(winstonConfig),
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
