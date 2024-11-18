import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { WsAdapter } from '@nestjs/platform-ws';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Environment } from '../config/http.config';
import { INestApplication, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const env = configService.get<Environment>('env');
    const port = configService.get<number>('port');
    const sessionSecret = configService.get<string>('sessionSecret');

    switch (env) {
        case Environment.Development:
        case Environment.Staging:
            setupSwagger(app);
            break;
        case Environment.Production:
            break;
    }

    setupSessionCookie(app, sessionSecret);

    app.useWebSocketAdapter(new WsAdapter(app));
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(port);
}

function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('BooQuiz')
        .setDescription('BooQuiz API description')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/swagger', app, document);
}

function setupSessionCookie(app: INestApplication, sessionSecret: string) {
    app.use(cookieParser());
    app.use(
        session({
            secret: sessionSecret,
            resave: false,
            saveUninitialized: true,
        }),
    );
}

bootstrap();
