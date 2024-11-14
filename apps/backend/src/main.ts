import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { WsAdapter } from '@nestjs/platform-ws';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const documentBuilderConfig = new DocumentBuilder()
        .setTitle('BooQuiz')
        .setDescription('BooQuiz API description')
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, documentBuilderConfig);

    SwaggerModule.setup('/swagger', app, documentFactory);

    app.use(cookieParser());
    app.use(
        session({
            secret: 'my-secret',
            resave: false,
            saveUninitialized: true,
        }),
    );

    app.useWebSocketAdapter(new WsAdapter(app));

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
