import { MovieModel } from "../models/movie.js";
import { validateMovie, validatePartialMovie } from "../schemas/movies.js";

export class MovieController {

    static async getAll(req, res) {
        const { genre } = req.query;
        const movies = await MovieModel.getAll({ genre });
        res.json(movies);
    }

    static async getById(req, res) {
        const { id } = req.params;
        const movie = await MovieModel.getById({ id });
        if (movie) {
            return res.json(movie);
        }
        res.status(404).json({ message: "Movie not found" });
    }

    static async create(req, res) {
        const result = validateMovie(req.body);
        if (result.error) {
            return res.status(400).json({ message: JSON.parse(result.error.message) });
        }

        await MovieModel.create(result.data);

        res.status(201).json(result);
    }

    static async update(req, res) {
        const result = validatePartialMovie(req.body);
        if (result.error) {
            return res.status(400).json(result.error.message);
        }
        const { id } = req.params;
        const comprobar = await MovieModel.update({ id, input });
        if (comprobar) {
            return res.json({ message: "Película modificada correctamente" });
        }
        return res.json({ message: "Movie not found" });
    }

    static async delete(req, res) {
        const { id } = req.params;
        const result = await MovieModel.delete({ id });
        if (result) {
            return res.json({ message: "Movie deleted" });
        }
        res.json({ message: "Movie not found" });
    }
}