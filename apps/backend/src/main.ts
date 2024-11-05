import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import cookieParser from 'cookie-parser';
// somewhere in your initialization file

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  app.use(cookieParser());
  app.use(
      session({
        secret: 'my-secret',
        resave: false,
        saveUninitialized: false,
      }),
  );
}
bootstrap();
