'use client';

import { useState, useEffect, useCallback } from 'react';

import { getMoviesByTitle } from './actions';

import { T_Movie } from './types/T_Movie';

import { debounce } from './helpers';

export default function HomePage () {
  const [title, setTitle] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [movies, setMovies] = useState<T_Movie[]>([]);
  const [isFetchError, setIsFetchError] = useState<boolean>(false);
  const [isDisableButton, setIsDisableButton] = useState<boolean>(false);
  const [recents, setRecents] = useState<string[]>([]);

  const suggestions: string[] = [
    'Spider-Man',
    'The Lion King',
    'The Lord of the Rings',
    'Harry Potter',
    'Pirates of the Caribbean',
  ];

  const saveSearchTerms = (cleanTitle: string) => {
    const searchTerms: string | null = localStorage.getItem('searchTerms');

    let newSearchTerms: string = '';

    if (searchTerms) newSearchTerms = searchTerms + ',' + cleanTitle;
    if (!searchTerms) newSearchTerms = cleanTitle;

    localStorage.setItem('searchTerms', newSearchTerms);

    const splitSearchTerms = newSearchTerms.split(',');

    setRecents(splitSearchTerms);
  }

  const clearSearchTerms = () => {
    localStorage.removeItem('searchTerms');
    setRecents([]);
  }

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
      saveSearchTerms(cleanTitle);
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

  useEffect(() => {
    if (title.length > 0) handleSearchMovies(title);
  }, [title]);

  useEffect(() => {
    const searchTerms: string | null = localStorage.getItem('searchTerms');

    if (searchTerms) {
      const splitSearchTerms = searchTerms.split(',');
      setRecents(splitSearchTerms);
    }
  }, []);

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

      {!isFetchError && movies.length === 0 && recents.length > 0 && (
        <div>
          <p>Recent Searches</p>
          <button
            className="w-full"
            type="button"
            onClick={() => clearSearchTerms()}
          >
            Clear Recent Searches
          </button>
          <div>
            {recents.map((searchTerm: string, index: number) => (
              <div key={index}>
                <button
                  className="w-full"
                  type="button"
                  onClick={() => setTitle(searchTerm)}
                >
                  {searchTerm}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isFetchError && movies.length === 0 && (
        <div>
          <p>Suggested Searches</p>
          <div>
            {suggestions.map((suggestion: string, index: number) => (
              <div key={index}>
                <button
                  className="w-full"
                  type="button"
                  onClick={() => setTitle(suggestion)}
                >
                  {suggestion}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isFetchError && movies.length > 0 && (
        <div>
          {movies.map((movie: T_Movie, index: number) => (
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
