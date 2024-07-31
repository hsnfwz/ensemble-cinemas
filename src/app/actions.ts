'use server';

import { T_Movie } from './types/T_Movie';
import { T_OMDBAPIResult } from './types/T_OMDBAPIResult';
import { T_OMDBAPIResultSearchObject } from './types/T_OMDBAPIResultSearchObject';

export async function getMoviesByTitle(title: string) {
  try {
    const response = await fetch(`http://www.omdbapi.com/?s=${title}*&type=movie&r=json&y&apikey=${process.env.OMDB_API_KEY}`);
    const result: T_OMDBAPIResult = await response.json();
    const movies: T_Movie[] = result.Search.map((omdbApiResultSearchObject: T_OMDBAPIResultSearchObject) => {
      return {
        poster: omdbApiResultSearchObject.Poster,
        title: omdbApiResultSearchObject.Title,
        yearOfRelease: omdbApiResultSearchObject.Year,
      }
    });

    return movies;
  } catch (error) {
    throw new Error(`500 Internal Server Error: Failed to fetch movies by title "${title}".`);
  }
}
