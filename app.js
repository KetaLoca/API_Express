const express = require("express");
const crypto = require("node:crypto");
const movies = require("./movies.json");
const z = require("zod");

const app = express();
app.disable("x-powered-by");

app.use(express.json());

app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.includes(genre)
    );
    return res.json(filteredMovies);
  }
  res.json(movies);
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id == id);
  if (movie) return res.json(movie);

  res.status(404).json({ message: "movie not found" });
});

app.post("/movies", (req, res) => {
  const movieSchema = z.object({
    title: z.string({
      invalid_type_error: 'Movie title must be a String',
      required_error: 'Movie title is required'
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    rate: z.number().min(0).max(10),
    poster: z.string().url({ message: 'Poster must be an URL' }),
    genre: z.array(
      z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
      {
        invalid_type_error: 'This must be an Array',
        required_error: 'Movie genre is required'
      }
    )
  })

  const { title, genre, year, director, duration, rate, poster } = req.body;

  if (!title || !genre || !year || !director || !duration || !rate || !poster) {
    return res.status(400).json({ message: "hay algún campo vacío" })
  }

  const movie = {
    id: crypto.randomUUID(),
    title,
    genre,
    year,
    director,
    duration,
    rate: rate ?? 0,
    poster,
  };

  movies.push(movie);

  res.status(201).json(movie);
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
