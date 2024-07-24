import z from 'zod'

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a String',
        required_error: 'Movie title is required'
    }),
    year: z.number().int().min(1900).max(2024),
    director: z.string(),
    rate: z.number().min(0).max(10).default(5),
    poster: z.string().url({ message: 'Poster must be an URL' }),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
        {
            invalid_type_error: 'This must be an Array',
            required_error: 'Movie genre is required'
        }
    )
})

export function validateMovie(object) {
    return movieSchema.safeParse(object)
}

export function validatePartialMovie(object) {
    return movieSchema.partial().safeParse(object)
}