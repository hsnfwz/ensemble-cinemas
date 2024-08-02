import { T_OMDBAPIResultSearchObject } from '@/app/types/T_OMDBAPIResultSearchObject';

export type T_OMDBAPIResult = {
  Search: T_OMDBAPIResultSearchObject[],
  totalResults: string,
  Response: string
}