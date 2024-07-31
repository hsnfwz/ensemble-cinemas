'use client';

import { useState, FormEvent } from 'react';
import { getMoviesByTitle } from '../actions';

import { T_Movie } from '../types/T_Movie';
import { T_MovieError } from '../types/T_MovieError';

export default function SearchBar () {
  const [movies, setMovies] = useState<T_Movie[]>([]);
  const [movieError, setMovieError] = useState<T_MovieError>();

  const search = async (event: FormEvent<HTMLInputElement>) => {
    const title = (event.target as HTMLInputElement).value;

    if (title.length === 0) {
      setMovies([]);
      return;
    }

    try {
      const _movies: T_Movie[] = await getMoviesByTitle(title);
      
      if (movieError) setMovieError(undefined);

      setMovies(_movies);
    } catch (error) {
      setMovieError({ title });
    }
  }

  const debounce = (func: Function, timeout = 500) => {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(func, args);
      }, timeout);
    };
  }

  const debounceSearch = debounce(search, 3000);

  return (
    <div>
      <input
        className="w-full"
        type="text"
        placeholder="Search movie by title (example: &quot;Deadpool&quot;)"
        onInput={(event) => debounceSearch(event)}
      />

      {movieError && (
        <div>Sorry! We could not find any movies with the title &quot;{movieError.title}&quot;</div>
      )}
    </div>
  );
}
