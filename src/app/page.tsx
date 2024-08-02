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
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

    if (searchTerms && searchTerms.includes(cleanTitle)) return;
    if (searchTerms && !searchTerms.includes(cleanTitle)) newSearchTerms = cleanTitle + ',' + searchTerms;
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
      setIsLoading(true);

      const nextPage: number = page + 1;

      const fetchedMovies: T_Movie[] = await getMoviesByTitle(title, nextPage);

      if (isFetchError) setIsFetchError(false);
      if (fetchedMovies.length < 10) setIsDisableButton(true);
      
      const allMovies: T_Movie[] = [...movies, ...fetchedMovies];

      setPage(nextPage);
      setMovies(allMovies);
      setIsLoading(false);
    } catch (error) {
      setIsDisableButton(true);
    }
  }

  const fetchMovies = async (cleanTitle: string) => {
    try {
      setIsLoading(true);

      const fetchedMovies: T_Movie[] = await getMoviesByTitle(cleanTitle);

      if (isFetchError) setIsFetchError(false);
      if (fetchedMovies.length < 10) setIsDisableButton(true);      

      setMovies(fetchedMovies);
      saveSearchTerms(cleanTitle);
      setIsLoading(false);
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
  
  const handleSearchMovies = useCallback(debounce(searchMovies, 1000), []);

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
    <main className="w-full max-w-screen-lg flex flex-col gap-16 m-auto px-4 mb-16 text-lg">

      <div className="w-[200px] h-[200px] bg-white/40 blur-[128px] rounded-full fixed -top-[100px] -left-[100px] -z-10"></div>
      <div className="w-[200px] h-[200px] bg-white/40 blur-[128px] rounded-full fixed -top-[100px] -right-[100px] -z-10"></div>

      <h1 className="font-limelight-regular uppercase text-3xl text-center mt-16">Ensemble<br/>Cinemas</h1>

      <div className="flex flex-col gap-8">
        <h2 className="font-roboto-bold w-full text-2xl">Search Movies</h2>
        <div className="flex gap-4">
          <input
            className="w-full rounded-full px-4 py-2 bg-transparent border-2 border-gray-700/60 focus:border-gray-500 focus:outline-none placeholder-gray-700 focus:placeholder-gray-500 focus:ring-0"
            type="text"
            placeholder="Search movie by title (example: &quot;Spider-Man&quot;)"
            onChange={(event) => {
              if (isFetchError) setIsFetchError(false);
              setTitle(event.target.value);
            }}
            value={title}
          />
          <button
            className="p-4 font-roboto-bold bg-gray-700/60 rounded-full disabled:opacity-40 hover:bg-gray-700 disabled:pointer-events-none"
            type="button"
            onClick={reset}
            disabled={isLoading || title.length === 0}
          >
            <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
          </button>
        </div>
      </div>

      {isFetchError && (
        <p className="text-center">Sorry! We could not find any movies with the title &quot;{title}&quot;</p>
      )}

      {isLoading && (
        <div className="self-center rounded-full border-2 border-t-sky-500 border-sky-500/60 animate-spin w-6 h-6 bg-transparent"></div>
      )}

      {!isLoading && !isFetchError && movies.length === 0 && (
        <div className="relative flex flex-col gap-16">
          <div className="flex flex-col gap-8">
            <h2 className="font-roboto-bold w-full text-2xl">Suggestions</h2>
            <div className="flex flex-wrap gap-4">
              {suggestions.map((suggestion: string, index: number) => (
                <div key={index}>
                  <button
                    className="px-4 py-2 rounded-full hover:bg-gray-700 hover:border-gray-700 bg-gray-700/60 border-2 border-gray-700/60 disabled:opacity-40 disabled:pointer-events-none"
                    type="button"
                    onClick={() => setTitle(suggestion)}
                    disabled={isLoading}
                  >
                    {suggestion}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="w-[200px] h-[200px] bg-white/40 blur-[128px] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"></div>

          {recents.length > 0 && (
            <div className="flex flex-col gap-8">
              <h2 className="font-roboto-bold w-full text-2xl">Recents</h2>
              <div className="flex flex-wrap gap-4">
                {recents.map((searchTerm: string, index: number) => (
                  <div key={index}>
                    <button
                      className="px-4 py-2 rounded-full hover:bg-gray-700 hover:border-gray-700 bg-gray-700/60 border-2 border-gray-700/60 disabled:opacity-40 disabled:pointer-events-none"
                      type="button"
                      onClick={() => setTitle(searchTerm)}
                      disabled={isLoading}
                    >
                      {searchTerm}
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="px-4 py-2 rounded-full hover:bg-sky-500 border-2 border-sky-500/60 self-start"
                type="button"
                onClick={() => clearSearchTerms()}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}

      {!isFetchError && movies.length > 0 && (
        <div className="flex flex-col gap-8">
          <h2 className="font-roboto-bold w-full text-2xl">Results</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
            {movies.map((movie: T_Movie, index: number) => (
              <div key={index} className="flex flex-col gap-4">
                <div className="aspect-[2/3]">
                  {movie.poster !== 'N/A' && (
                    <img src={movie.poster} alt={movie.title} width="200px" height="300px" className="rounded-lg w-full" />
                  )}
                  {movie.poster === 'N/A' && (
                    <img src={`https://placehold.co/200x300/374151/white/?text=${movie.title}&font=roboto/`} className="rounded-lg w-full" />
                  )}
                </div>
                <p>{movie.title} ({movie.yearOfRelease})</p>
                <button
                  className="px-4 py-2 rounded-full hover:bg-gray-700 hover:border-gray-700 bg-gray-700/60 border-2 border-gray-700/60 mt-auto"
                  type="button"
                  onClick={() => {}}
                >
                  Button
                </button>
              </div>
            ))}
          </div>
          {!isLoading && (
            <button
              className="px-4 py-2 rounded-full hover:bg-sky-500 border-2 border-sky-500/60 self-center disabled:opacity-40 disabled:pointer-events-none"
              type="button"
              onClick={fetchMoviesNextPage}
              disabled={isLoading || isDisableButton || page === 100}
            >
              Show More
            </button>
          )}
          {isLoading && (
            <div className="self-center rounded-full border-2 border-t-sky-500 border-sky-500/60 animate-spin w-6 h-6 bg-transparent"></div>
          )}
          {isDisableButton && (
            <p className="text-center">Wow! You have viewed all movies with the title &quot;{title}&quot;</p>
          )}
        </div>
      )}

      <div className="h-[2px] w-full bg-gray-700/60 rounded-full"></div>

      <footer>
        <p className="text-center text-gray-700/60">Designed and built by Hussein Fawaz</p>
      </footer>
    </main>
  );
}
