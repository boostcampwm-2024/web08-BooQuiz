import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizZoneModule } from './quiz-zone/quiz-zone.module';

@Module({
  imports: [QuizZoneModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
