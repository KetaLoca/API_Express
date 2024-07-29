import { json, Router } from "express";
import { validateMovie, validatePartialMovie } from "./schemas/movies.js";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
const require = createRequire(import.meta.url);
const movies = require("./movies.json");
const router = Router();

router.get("/", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() == genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }
  res.json(movies);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id == id);
  if (movie) {
    return res.json(movie);
  }
  res.status(404).json({ message: "Movie not found" });
});

router.post("/", (req, res) => {
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

router.patch("/:id", (req, res) => {
  const result = validatePartialMovie(req.body);
  if (result.error) {
    return res.status(400).json(result.error.message);
  }

  const { id } = req.params;
  const MovieIndex = movies.findIndex((movie) => movie.id == id);
  if (MovieIndex == -1) {
    return res.status(404).json({ message: "Movie not found" });
  }
  const updatedMovie = { ...movies[MovieIndex].data, ...result.data };
  movies[MovieIndex] = updatedMovie;
  res.json(updatedMovie);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id == id);
  if (movieIndex == -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movies.splice(movieIndex, 1);
  res.json({ message: "Movie deleted" });
});
