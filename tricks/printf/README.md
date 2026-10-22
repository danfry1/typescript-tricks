# printf

A `format` function whose arguments are typed from its format string: `%s` takes a string and `%d` takes a number.

```ts
type Spec = { s: string; d: number }; // what each %-specifier takes
type Args<F extends string> =
  F extends `${string}%${infer K}${infer R}` ? K extends keyof Spec ? [Spec[K], ...Args<R>] : Args<R> : [];

declare function format<F extends string>(fmt: F, ...args: Args<F>): string;

format("%s is %d years old", "Dan", 31);
format("100%% sure");
// @ts-expect-error %d needs a number
format("%s is %d years old", "Dan", "31");
// @ts-expect-error missing an argument
format("%s is %d years old", "Dan");
// @ts-expect-error one argument too many
format("%s", "Dan", 31);
```

[Open in TS Playground][playground]

## How it works

- `Args` walks the format string with a template literal, `` `${string}%${infer K}${infer R}` ``. `${string}` skips ahead to the next `%`, `K` is the character after it, and `R` is the rest of the string.
- If `K` is a key of `Spec`, its type goes into a tuple and `Args` carries on with `R`. Anything else, like the second `%` in `%%`, is skipped.
- `format` spreads that tuple as its rest parameter, so TypeScript checks the number of arguments and the type of each one, with its usual errors like `Expected 3 arguments, but got 2`.

To add a specifier, add a key to `Spec`, for example `j: unknown`.

## Limits

- The format has to be a string literal. A format typed as plain `string` accepts no extra arguments, so it fails safe instead of letting anything through.
- Unknown specifiers like `%x` are ignored rather than rejected.
- No widths, precision or flags like `%5d` or `%.2f`: the character after `%` has to be the specifier.

[playground]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAypDGUC8UDeUDOAuTwBOAlgHYDmA3FACY5ECuAtgEYR5QC+FA9J1AO4AWAQ2BQIg+PygBSALQYEBAGYEWUYIIDWEDAChQkKAEE8JDAB4AYqIAewCEUoZchUgD5kOqFCsRb9x1AABgAkqBj4xCRsUqHEiqoA0myxRPGsAEpsgVAA-FAJNnYOTlogAPaKsAi5UADacBDwtQkAugA0UAB03camZumuLVA4veYDw3UtZDo6lI0ANoJ40Iq0RPDABGVEUIplePTCloX+TuEuJK4AFIr0wDgWHd2dS6YjJuYWrgCUOOeR0x0ewOwiuACIpE4CE4pJQoCAxHgnGV5pQwR0wQARQREdFQADMAEZvtNgYdgODCQAGKlSKSYWjLMEknTcKAAAWAGBkvgQwB5eDw+2kcKIEAgAUEUDoTBYQP25PBkKg0JF8MRyNReKxOO1ROZ0zZnO5vMa-JYQtY9GhGEiUBx9pMDHswHlIIpEKhMLhCKWmrRGOxuJZRq5POsfIFlqg22gr2dRBEwDKZSghyIIDdis92qDeKJLKAA
