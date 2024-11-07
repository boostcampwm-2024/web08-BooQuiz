import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizZoneModule } from './quiz-zone/quiz-zone.module';
import { PlayModule } from './play/play.module';

@Module({
  imports: [QuizZoneModule, PlayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
