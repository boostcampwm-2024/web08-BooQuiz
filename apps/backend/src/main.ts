import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.use(
        session({
            secret: 'my-secret',
            resave: true,
            saveUninitialized: true,
        }),
    );

    app.useWebSocketAdapter(new WsAdapter(app));

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
