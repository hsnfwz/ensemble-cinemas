
type Props = {
  label: string,
}

export default function Header(props: Props) {

  return (
    <h2 className="font-roboto-bold w-full text-2xl">{props.label}</h2>
  );
}
