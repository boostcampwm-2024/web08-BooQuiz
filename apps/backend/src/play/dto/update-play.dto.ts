import { PartialType } from '@nestjs/mapped-types';
import { CreatePlayDto } from './create-play.dto';

export class UpdatePlayDto extends PartialType(CreatePlayDto) {
  id: number;
}
