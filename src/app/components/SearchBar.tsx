import { ChangeEvent } from 'react';

type Props = {
  value: string,
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void,
}

export default function SearchBar(props: Props) {

  return (
    <input
      className="w-full rounded-full px-4 py-2 bg-transparent border-2 border-gray-700/60 focus:border-gray-500 focus:outline-none placeholder-gray-700 focus:placeholder-gray-500 focus:ring-0"
      type="text"
      placeholder="Search movie by title (example: &quot;Spider-Man&quot;)"
      value={props.value}
      onChange={props.handleChange}
    />
  );
}
