import { Module } from '@nestjs/common';
import { PlayService } from './play.service';
import { PlayGateway } from './play.gateway';
import { QuizZoneModule } from '../quiz-zone/quiz-zone.module';

@Module({
    imports: [QuizZoneModule],
    providers: [
        PlayGateway,
        {
            provide: 'PlayInfoStorage',
            useValue: new Map(),
        },
        {
            provide: 'ClientInfoStorage',
            useValue: new Map(),
        },
        PlayService,
    ],
})
export class PlayModule {}