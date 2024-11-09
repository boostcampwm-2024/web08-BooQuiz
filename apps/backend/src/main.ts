import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';

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

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
