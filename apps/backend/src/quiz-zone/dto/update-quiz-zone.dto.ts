import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizZoneDto } from './create-quiz-zone.dto';

export class UpdateQuizZoneDto extends PartialType(CreateQuizZoneDto) {}
