import { Injectable } from '@nestjs/common';
import { CreatePlayDto } from './dto/create-play.dto';
import { UpdatePlayDto } from './dto/update-play.dto';

@Injectable()
export class PlayService {
  create(createPlayDto: CreatePlayDto) {
    return 'This action adds a new play';
  }

  findAll() {
    return `This action returns all play`;
  }

  findOne(id: number) {
    return `This action returns a #${id} play`;
  }

  update(id: number, updatePlayDto: UpdatePlayDto) {
    return `This action updates a #${id} play`;
  }

  remove(id: number) {
    return `This action removes a #${id} play`;
  }
}
