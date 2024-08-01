'use client';

import { useState, FormEvent } from 'react';
import { getMoviesByTitle } from './actions';

import { T_Movie } from './types/T_Movie';

export default function HomePage () {
  const [movies, setMovies] = useState<T_Movie[]>([]);
  const [isFetchError, setIsFetchError] = useState<boolean>(false);
  const [isDisableButton, setIsDisableButton] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [title, setTitle] = useState<string>('');

  const load = async () => {
    try {
      const nextPage = page + 1;

      const fetchedMovies: T_Movie[] = await getMoviesByTitle(title, nextPage);

      if (fetchedMovies.length < 10) setIsDisableButton(true);
      
      const loadedMovies: T_Movie[] = [...movies, ...fetchedMovies];

      setMovies(loadedMovies);
      setPage(nextPage);
    } catch (error) {
      setIsDisableButton(true);
    }
  }

  const search = async (event: FormEvent<HTMLInputElement>) => {
    const titleValue: string = (event.target as HTMLInputElement).value;

    if (titleValue.length === 0) {
      setMovies([]);
      setIsFetchError(false);
      setPage(1);
      setIsDisableButton(false);
      return;
    }

    setPage(1);
    setIsDisableButton(false);

    setTitle(titleValue);

    try {
      const fetchedMovies: T_Movie[] = await getMoviesByTitle(titleValue);
      
      if (isFetchError) setIsFetchError(false);

      setMovies(fetchedMovies);
    } catch (error) {
      setIsFetchError(true);
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
        onInput={debounceSearch}
      />

      {isFetchError && (
        <div>Sorry! We could not find any movies with the title &quot;{title}&quot;</div>
      )}

      {!isFetchError && movies.length > 0 && (
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
            disabled={isDisableButton || page === 100}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
