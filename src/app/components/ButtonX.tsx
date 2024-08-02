
type Props = {
  handleClick: () => void,
  disabled?: boolean,
}

export default function ButtonX(props: Props) {

  return (
    <button
      className="p-4 rounded-full hover:bg-gray-700 hover:border-gray-700 bg-gray-700/60 border-2 border-gray-700/60 disabled:opacity-40 disabled:pointer-events-none"    
      type="button"
      onClick={props.handleClick}
      disabled={props.disabled}
    >
      <svg width="24px" height="24px" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
    </button>
  );
}
