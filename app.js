const express = require("express");
const crypto = require("node:crypto");
const movies = require("./movies.json");
const { validateMovie } = require("./schemas/movies");

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
  // const { title, genre, year, director, duration, rate, poster } = req.body;

  // if (!title || !genre || !year || !director || !duration || !rate || !poster) {
  //   return res.status(400).json({ message: "hay algún campo vacío" })
  // }

  // const movie = {
  //   id: crypto.randomUUID(),
  //   title,
  //   genre,
  //   year,
  //   director,
  //   duration,
  //   rate: rate ?? 0,
  //   poster,
  // };

  const result = validateMovie(req.body)

  if (result.error) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const movie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(movie);

  res.status(201).json(movie);
});

app.patch("/movies/:id", (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id == id)

  if (movieIndex == -1) { return res.status(404).json({ message: 'Movie not found' }) }

  const movie = movies[movieIndex]
})

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
