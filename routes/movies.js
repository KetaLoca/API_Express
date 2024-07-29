import { Router } from "express";
import { validateMovie, validatePartialMovie } from "../schemas/movies.js";
import { MovieModel } from "../models/movie.js";

export const moviesRouter = Router();

moviesRouter.get("/", async (req, res) => {
  const { genre } = req.query;
  const movies = await MovieModel.getAll({ genre });
  res.json(movies);
});

moviesRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const movie = await MovieModel.getById({ id });
  if (movie) {
    return res.json(movie);
  }
  res.status(404).json({ message: "Movie not found" });
});

moviesRouter.post("/", async (req, res) => {
  const result = validateMovie(req.body);
  if (result.error) {
    return res.status(400).json({ message: JSON.parse(result.error.message) });
  }

  await MovieModel.create(result.data);

  res.status(201).json(movie);
});

moviesRouter.patch("/:id", async (req, res) => {
  const result = validatePartialMovie(req.body);
  if (result.error) {
    return res.status(400).json(result.error.message);
  }
  const { id } = req.params;
  const comprobar = await MovieModel.update(id, result);
  if (comprobar) {
    return res.json({ message: "Película modificada correctamente" });
  }
  return res.json({ message: "Movie not found" });
});

moviesRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await MovieModel.delete(id);
  if (result) {
    return res.json({ message: "Movie deleted" });
  }
  res.json({ message: "Movie not found" });
});
