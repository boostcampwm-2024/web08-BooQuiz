import { Module } from '@nestjs/common';
import { PlayService } from './play.service';
import { PlayGateway } from './play.gateway';

@Module({
  providers: [PlayGateway, PlayService],
})
export class PlayModule {}
