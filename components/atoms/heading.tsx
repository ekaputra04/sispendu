export function Heading1({ text }: { text: string }) {
  return <h1 className="mb-4 font-semibold text-xl">{text}</h1>;
}

export function Heading2({ text }: { text: string }) {
  return <h2 className="mb-4 font-semibold text-md">{text}</h2>;
}
