'use client';

import { useState, FormEvent, useEffect, useCallback } from 'react';

import { getMoviesByTitle } from './actions';

import { T_Movie } from './types/T_Movie';

import { debounce } from './helpers';

export default function HomePage () {
  const [title, setTitle] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [movies, setMovies] = useState<T_Movie[]>([]);
  const [isFetchError, setIsFetchError] = useState<boolean>(false);
  const [isDisableButton, setIsDisableButton] = useState<boolean>(false);

  const suggestions: string[] = [
    'Spider-Man',
    'The Lion King',
    'The Lord of the Rings',
    'Harry Potter',
    'Pirates of the Caribbean',
  ]

  const fetchMoviesNextPage = async () => {
    try {
      const nextPage: number = page + 1;

      const fetchedMovies: T_Movie[] = await getMoviesByTitle(title, nextPage);

      if (fetchedMovies.length < 10) setIsDisableButton(true);
      
      const allMovies: T_Movie[] = [...movies, ...fetchedMovies];

      setPage(nextPage);
      setMovies(allMovies);
    } catch (error) {
      setIsDisableButton(true);
    }
  }

  const fetchMovies = async (cleanTitle: string) => {
    try {
      const fetchedMovies: T_Movie[] = await getMoviesByTitle(cleanTitle);
      
      if (isFetchError) setIsFetchError(false);

      setMovies(fetchedMovies);
    } catch (error) {
      setIsFetchError(true);
    }
  }

  const searchMovies = async (searchTerm: string) => {    
    const cleanTitle: string = searchTerm.trim();

    if (cleanTitle.length === 0) {
      setPage(1);
      setMovies([]);
      setIsFetchError(false);
      setIsDisableButton(false);
      return;
    }

    setPage(1);
    setIsDisableButton(false);

    await fetchMovies(cleanTitle);
  }

  const reset = () => {
    setTitle('');
    setPage(1);
    setMovies([]);
    setIsFetchError(false);
    setIsDisableButton(false);
  }
  
  const handleSearchMovies = useCallback(debounce(searchMovies, 3000), []);

  useEffect(() => handleSearchMovies(title), [title]);

  return (
    <div>
      <input
        className="w-full"
        type="text"
        placeholder="Search movie by title (example: &quot;Spider-Man&quot;)"
        onChange={(event) => {
          if (isFetchError) setIsFetchError(false);
          setTitle(event.target.value);
        }}
        value={title}
      />

      <button
        className="w-full"
        type="button"
        onClick={reset}
      >
        Clear
      </button>

      {isFetchError && (
        <div>Sorry! We could not find any movies with the title &quot;{title}&quot;</div>
      )}

      {!isFetchError && movies.length === 0 && (
        <div>
          {suggestions.map((suggestion, index) => (
            <div key={index}>
              <button
                className="w-full"
                type="button"
                onClick={async () => {
                  await fetchMovies(suggestion);
                  setTitle(suggestion);
                }}
              >
                {suggestion}
              </button>
            </div>
          ))}
        </div>
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
            onClick={fetchMoviesNextPage}
            disabled={isDisableButton || page === 100}
          >
            Show More
          </button>

          {isDisableButton && (
            <p>You have viewed all results!</p>
          )}
        </div>
      )}
    </div>
  );
}
