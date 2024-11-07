import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { PlayService } from './play.service';
import { CreatePlayDto } from './dto/create-play.dto';
import { UpdatePlayDto } from './dto/update-play.dto';

@WebSocketGateway()
export class PlayGateway {
  constructor(private readonly playService: PlayService) {}

  @SubscribeMessage('createPlay')
  create(@MessageBody() createPlayDto: CreatePlayDto) {
    return this.playService.create(createPlayDto);
  }

  @SubscribeMessage('findAllPlay')
  findAll() {
    return this.playService.findAll();
  }

  @SubscribeMessage('findOnePlay')
  findOne(@MessageBody() id: number) {
    return this.playService.findOne(id);
  }

  @SubscribeMessage('updatePlay')
  update(@MessageBody() updatePlayDto: UpdatePlayDto) {
    return this.playService.update(updatePlayDto.id, updatePlayDto);
  }

  @SubscribeMessage('removePlay')
  remove(@MessageBody() id: number) {
    return this.playService.remove(id);
  }
}
