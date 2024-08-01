'use client';

import { useState, FormEvent, useRef } from 'react';
import { getMoviesByTitle } from '../actions';

import { T_Movie } from '../types/T_Movie';
import { T_MovieError } from '../types/T_MovieError';

export default function SearchBar () {
  const [movies, setMovies] = useState<T_Movie[]>([]);
  const [movieError, setMovieError] = useState<T_MovieError>();
  const [disableLoadMore, setDisableLoadMore] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    try {
      const nextPage = page + 1;

      const title: string | undefined = inputRef.current?.value;

      if (!title) return;

      const fetchedMovies: T_Movie[] = await getMoviesByTitle(title, nextPage);

      if (fetchedMovies.length < 10) setDisableLoadMore(true);
      
      const loadedMovies: T_Movie[] = [...movies, ...fetchedMovies];

      setMovies(loadedMovies);
      setPage(nextPage);
    } catch (error) {
      setDisableLoadMore(true);
    }
  }

  const search = async (event: FormEvent<HTMLInputElement>) => {
    const title: string = (event.target as HTMLInputElement).value;

    if (title.length === 0) {
      setMovies([]);
      setMovieError(undefined);
      setPage(1);
      setDisableLoadMore(false);
      return;
    }

    setPage(1);
    setDisableLoadMore(false);

    try {
      const fetchedMovies: T_Movie[] = await getMoviesByTitle(title);
      
      if (movieError) setMovieError(undefined);

      setMovies(fetchedMovies);
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
        ref={inputRef}
        className="w-full"
        type="text"
        placeholder="Search movie by title (example: &quot;Deadpool&quot;)"
        onInput={(event) => debounceSearch(event)}
      />

      {movieError && (
        <div>Sorry! We could not find any movies with the title &quot;{movieError.title}&quot;</div>
      )}

      {!movieError && movies.length > 0 && (
        <div>
          {movies.map((movie, index) => (
            <div key={index}>
              {movie.poster !== 'N/A' && (
                <img src={movie.poster} alt={movie.title} width="200px" height="300px" />
              )}
              {movie.poster === 'N/A' && (
                <div className="w-[200px] h-[300px] bg-gray-800"></div>
              )}
              <p>{movie.title}</p>
              <p>{movie.yearOfRelease}</p>
            </div>
          ))}

          <button
            className="w-full"
            type="button"
            onClick={load}
            disabled={disableLoadMore || page === 100}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
