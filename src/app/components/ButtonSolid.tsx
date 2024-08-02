
type Props = {
  label: string,
  handleClick: () => void,
  disabled?: boolean,
}

export default function ButtonSolid(props: Props) {

  return (
    <button
      className="w-full px-4 py-2 rounded-full hover:bg-gray-700 hover:border-gray-700 bg-gray-700/60 border-2 border-gray-700/60 disabled:opacity-40 disabled:pointer-events-none"    
      type="button"
      onClick={props.handleClick}
      disabled={props.disabled}
    >
      {props.label}
    </button>
  );
}
