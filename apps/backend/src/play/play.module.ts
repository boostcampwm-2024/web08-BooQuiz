import { Module } from '@nestjs/common';
import { PlayService } from './play.service';
import { PlayGateway } from './play.gateway';
import { QuizZoneModule } from '../quiz-zone/quiz-zone.module';

@Module({
    imports: [QuizZoneModule],
    providers: [
        PlayGateway,
        PlayService,
        {
            provide: 'PlayInfoStorage',
            useValue: new Map(),
        },
    ],
})
export class PlayModule {}
