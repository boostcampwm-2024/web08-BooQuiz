import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Environment } from '../config/http.config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SessionWsAdapter } from './core/SessionWsAdapter';
import { initializeTransactionalContext } from 'typeorm-transactional';

async function bootstrap() {
    initializeTransactionalContext();

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

    const sessionMiddleware = session({
        secret: sessionSecret,
        resave: false,
        saveUninitialized: true,
    });

    app.use(cookieParser());
    app.use(sessionMiddleware);

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useWebSocketAdapter(new SessionWsAdapter(app, sessionMiddleware));

    await app.listen(port);
}

function setupSwagger(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle('BooQuiz')
        .setDescription('BooQuiz API description')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api/swagger', app, document);
}

bootstrap();
