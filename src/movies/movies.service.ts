import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatemovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  getAll(): Movie[] {
    return this.movies;
  }

  getOne(id: number): Movie {
    const movie = this.movies.find((movie) => movie.id === id);

    if (!movie) {
      throw new NotFoundException(`Movie with ID:${id} not found`);
    }
    return movie;
  }
  deleteOne(id: number) {
    this.getOne(id);
    const filterdMovies = this.movies.filter((movie) => movie.id !== id);
    this.movies = filterdMovies;
    return true;
  }
  create(movieData: CreatemovieDto) {
    this.movies.push({
      id: this.movies.length + 1,
      ...movieData,
    });
    return this.movies[this.movies.length - 1];
  }
  update(id: number, updateData: UpdateMovieDto) {
    const index = this.movies.findIndex((movie) => movie.id === id);
    this.movies[index] = { ...this.movies[index], ...updateData };
    // this.movies.push({ ...movie, ...updateData });
  }
}
