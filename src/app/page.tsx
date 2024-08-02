'use client';

import { useState, useEffect, useCallback, ChangeEvent } from 'react';
import Image from 'next/image';

import { getMoviesByTitle } from '@/app/actions';

import { T_Movie } from '@/app/types/T_Movie';

import { debounce } from '@/app/helpers';

import LoadIndicator from '@/app/components/LoadIndicator';
import ButtonOutline from '@/app/components/ButtonOutline';
import ButtonSolid from '@/app/components/ButtonSolid';
import ButtonX from '@/app/components/ButtonX';
import DividerHorizontal from '@/app/components/DividerHorizontal';
import Header from '@/app/components/Header';
import SearchBar from '@/app/components/SearchBar';
import Logo from '@/app/components/Logo';

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

  useEffect(() => handleSearchMovies(title), [title]);

  useEffect(() => {
    const searchTerms: string | null = localStorage.getItem('searchTerms');

    if (searchTerms) {
      const splitSearchTerms: string[] = searchTerms.split(',');
      setRecents(splitSearchTerms);
    }
  }, []);

  return (
    <main className="w-full max-w-screen-lg flex flex-col gap-16 m-auto px-4 mb-16 text-lg">

      <div className="w-[200px] h-[200px] bg-white/40 blur-[128px] rounded-full fixed -top-[100px] -left-[100px] -z-10"></div>
      <div className="w-[200px] h-[200px] bg-white/40 blur-[128px] rounded-full fixed -top-[100px] -right-[100px] -z-10"></div>

      <Logo />

      <section className="flex flex-col gap-8">
        <Header label="Search Movies" />
        <div className="flex gap-4">
          <SearchBar
            handleChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
            value={title}
          />
          <ButtonX
            handleClick={reset}
            disabled={isLoading || title.length === 0}
          />
        </div>
      </section>

      {isFetchError && (
        <p className="text-center">Sorry! We could not find any movies with the title &quot;{title}&quot;</p>
      )}

      {isLoading && (
        <LoadIndicator />
      )}

      {!isLoading && !isFetchError && movies.length === 0 && (
        <div className="relative flex flex-col gap-16">
          <section className="flex flex-col gap-8">
            <Header label="Suggestions" />
            <div className="flex flex-wrap gap-4">
              {suggestions.map((suggestion: string, index: number) => (
                <div key={index}>
                  <ButtonSolid
                    label={suggestion}
                    handleClick={() => setTitle(suggestion)}
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="w-[200px] h-[200px] bg-white/40 blur-[128px] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"></div>

          {recents.length > 0 && (
            <section className="flex flex-col gap-8">
              <Header label="Recents" />
              <div className="flex flex-wrap gap-4">
                {recents.map((searchTerm: string, index: number) => (
                  <div key={index}>
                    <ButtonSolid
                      label={searchTerm}
                      handleClick={() => setTitle(searchTerm)}
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </div>
              <ButtonOutline
                label="Clear All"
                handleClick={clearSearchTerms}
              />
            </section>
          )}
        </div>
      )}

      {!isFetchError && movies.length > 0 && (
        <section className="flex flex-col gap-8">
          <Header label="Results" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
            {movies.map((movie: T_Movie, index: number) => (
              <div key={index} className="flex flex-col gap-4">
                <div className="aspect-[2/3]">
                  <Image
                    src={movie.poster === 'N/A' ? `https://placehold.co/200x300/374151/ffffff/png/?text=${movie.title}&font=roboto/` : movie.poster}
                    alt={movie.title}
                    width="200"
                    height="300"
                    className="rounded-lg w-full"
                  />
                </div>
                <p>{movie.title} ({movie.yearOfRelease})</p>
                <div className="mt-auto">
                  <ButtonSolid
                    label="Button"
                    handleClick={() => {}}
                  />
                </div>
              </div>
            ))}
          </div>
          {!isLoading && (
            <ButtonOutline
              label="Show More"
              handleClick={fetchMoviesNextPage}
              disabled={isLoading || isDisableButton || page === 100}
            />
          )}
          {isLoading && (
            <LoadIndicator />
          )}
          {isDisableButton && (
            <p className="text-center">Wow! You have viewed all movies with the title &quot;{title}&quot;</p>
          )}
        </section>
      )}

      <DividerHorizontal />

      <footer>
        <p className="text-center text-gray-700/60">Designed and built by Hussein Fawaz</p>
      </footer>
    </main>
  );
}
