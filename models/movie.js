import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const movies = require("../movies.json");
import { randomUUID } from "node:crypto";

export class MovieModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      return movies.filter((movie) =>
        movie.genre.some((g) => g.toLowerCase() == genre.toLowerCase())
      );
    }
    return movies;
  };

  static async getById({ id }) {
    const movie = movies.find((movie) => movie.id == id);
    return movie;
  }

  static async create(input) {
    const movie = { id: randomUUID(), ...input.data };
    movies.push(movie);
  }

  static async update({ id, input }) {
    const MovieIndex = movies.findIndex((movie) => movie.id == id);
    if (MovieIndex == -1) {
      return false;
    }
    const updatedMovie = { ...movies[MovieIndex], ...input.data };
    movies[MovieIndex] = updatedMovie;
    return true;
  }

  static async delete({ id }) {
    const movieIndex = movies.findIndex((movie) => movie.id == id);
    if (movieIndex == -1) {
      return false;
    }
    movies.splice(movieIndex, 1);
    return true;
  }
}
