import { Router } from "express";
import { validateMovie, validatePartialMovie } from "../schemas/movies.js";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
const require = createRequire(import.meta.url);
const movies = require("../movies.json");

export const moviesRouter = Router();

moviesRouter.get("/", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some(
        (g) => g.toLocaleLowerCase() == genre.toLocaleLowerCase()
      )
    );
    return res.json(filteredMovies);
  }
  res.json(movies);
});

moviesRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id == id);
  if (movie) {
    return res.json(movie);
  }
  res.status(404).json({ message: "Movie not found" });
});

moviesRouter.post("/", (req, res) => {
  const result = validateMovie(req.body);
  if (result.error) {
    return res.status(400).json({ message: JSON.parse(result.error.message) });
  }

  const movie = {
    id: randomUUID(),
    ...result.data,
  };

  movies.push(movie);

  res.status(201).json(movie);
});

moviesRouter.patch("/:id", (req, res) => {
  const result = validatePartialMovie(req.body);
  if (result.error) {
    return res.status(400).json(result.error.message);
  }

  const { id } = req.params;
  const MovieIndex = movies.findIndex((movie) => movie.id == id);
  if (MovieIndex == -1) {
    return res.status(404).json({ message: "Movie not found" });
  }
  const updatedMovie = { ...movies[MovieIndex], ...result.data };
  movies[MovieIndex] = updatedMovie;
  res.json(updatedMovie);
});

moviesRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id == id);
  if (movieIndex == -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movies.splice(movieIndex, 1);
  res.json({ message: "Movie deleted" });
});
