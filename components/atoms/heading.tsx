export function Heading1({ text }: { text: string }) {
  return <h1 className="block font-semibold text-xl">{text}</h1>;
}

export function Heading2({ text }: { text: string }) {
  return <h2 className="block font-semibold text-md">{text}</h2>;
}
