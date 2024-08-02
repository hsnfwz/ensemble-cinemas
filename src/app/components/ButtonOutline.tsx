
type Props = {
  label: string,
  handleClick: () => void,
  disabled?: boolean,
}

export default function ButtonOutline(props: Props) {

  return (
    <button
      className="w-full px-4 py-2 rounded-full hover:bg-sky-500 border-2 border-sky-500/60 disabled:opacity-40 disabled:pointer-events-none"
      type="button"
      onClick={props.handleClick}
      disabled={props.disabled}
    >
      {props.label}
    </button>
  );
}
