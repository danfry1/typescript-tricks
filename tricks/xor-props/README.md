# xor-props

An object type that needs exactly one of two sets of props, like a button that takes `href` or `onClick` but not both.

```ts
// Either A or B: each side forbids the other side's keys.
type Xor<A, B> = (A & { [K in keyof B]?: never }) | (B & { [K in keyof A]?: never });

type ButtonProps = { label: string } & Xor<{ href: string }, { onClick: () => void }>;

const link: ButtonProps = { label: "Docs", href: "/docs" };
const button: ButtonProps = { label: "Save", onClick: () => {} };
// @ts-expect-error both href and onClick
const both: ButtonProps = { label: "Huh", href: "/docs", onClick: () => {} };
// @ts-expect-error neither href nor onClick
const neither: ButtonProps = { label: "Huh" };
```

[Open in TS Playground][playground]

## How it works

- `Xor<A, B>` is a union of two options. One is `A` with every key of `B` marked as `?: never`, and the other is `B` with every key of `A` marked as `?: never`.
- An optional `never` key can only be left out, so each option forbids the other option's props.
- Leaving out both sets fails too, because each option still needs its own props.

Checking `props.href !== undefined` narrows `props` to the `href` option, so `onClick` is known to be there in the `else` branch.

## Limits

- `?: never` still accepts `undefined`, so `{ href: undefined, onClick }` gets through. Turn on `exactOptionalPropertyTypes` to reject it.
- With more than two options, nesting (`Xor<A, Xor<B, C>>`) works, but the error messages get harder to read.

[playground]: https://www.typescriptlang.org/play?#code/PTAEFEEsBcAsFMBOoCCoD2yBCAuU8BDAY1lAGdIATeUAM0wCMqzQ4b03kLqByFga3gBPMgDoAUNCEAHGgA1MAHhQAaUFgB8oALygAFGgBkoAN6gA2gGlQkAHahBQ9LXUBdAPx5b8AG5JQAL4AlKAAPvpYoMZmVjb2js6oHl6+-sEA3OKSMjRYAK7Q0Oi2AAqI6NIsumYANgQM8DV4ZNCIdgDmgVGgCoiKZrCI8LTNrR2BambFAMI1kET8eHoh2lo+6FSBGpniRMUtoHO2i+oFRaXllTqmh-WNeABEACLoRGQPaoPDj8CUr++BTJ7WwHBhnYp4fKFYplCpVG51BpNUAPADKBD8Hwwtlm8xOyx0WhMAUB4hAoAAAtAyABaeAAD1kRGgdMQ5WQDA4pC+LgItko2NxC12+2goE5cEh4IucOutTuyIeAAk8rAsTyfn83liZnMFksVkSSQFMuSqbSGUyWUh2aBvDAEMgeXbMIK9fwRSCxfbOFLoTKrtVbkjHiq1aSgA
