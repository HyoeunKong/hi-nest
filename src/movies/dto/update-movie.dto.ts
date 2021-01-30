import { PartialType } from '@nestjs/mapped-types';
import { CreatemovieDto } from './create-movie.dto';

export class UpdateMovieDto extends PartialType(CreatemovieDto) {}
