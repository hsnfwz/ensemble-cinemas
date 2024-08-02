'use server';

// types
import { T_Movie } from '@/app/types/T_Movie';
import { T_OMDBAPIResult } from '@/app/types/T_OMDBAPIResult';
import { T_OMDBAPIResultSearchObject } from '@/app/types/T_OMDBAPIResultSearchObject';

// fetches movies from the OMDb API (https://www.omdbapi.com/) and formats the returned data
export async function getMovies(title: string = '', page: number = 1) {
  try {    
    const response = await fetch(`http://www.omdbapi.com/?s=${title}*&page=${page}&type=movie&apikey=${process.env.OMDB_API_KEY}`);
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
    throw new Error(`Failed to fetch movies by title "${title}".`);
  }
}
