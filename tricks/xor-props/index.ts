// Either A or B: each side forbids the other side's keys.
type Xor<A, B> = (A & { [K in keyof B]?: never }) | (B & { [K in keyof A]?: never });

type ButtonProps = { label: string } & Xor<{ href: string }, { onClick: () => void }>;

const link: ButtonProps = { label: "Docs", href: "/docs" };
const button: ButtonProps = { label: "Save", onClick: () => {} };
// @ts-expect-error both href and onClick
const both: ButtonProps = { label: "Huh", href: "/docs", onClick: () => {} };
// @ts-expect-error neither href nor onClick
const neither: ButtonProps = { label: "Huh" };
