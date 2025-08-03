export function Heading1({ text }: { text: string }) {
  return <h1 className="block font-bold text-primary text-2xl">{text}</h1>;
}

export function Heading2({ text }: { text: string }) {
  return <h2 className="block font-semibold text-primary text-lg">{text}</h2>;
}
