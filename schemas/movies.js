const z = require("zod");

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

function validateMovie(object) {
    return movieSchema.safeParse(object)
}

module.exports = {
    validateMovie
}