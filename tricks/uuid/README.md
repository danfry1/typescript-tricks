# uuid

A function parameter that only accepts UUIDs in the standard 8-4-4-4-12 hex format.

```ts
type End = "" & String;
type C = string & {};
type Hex = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a" | "b" | "c" | "d" | "e" | "f" | "A" | "B" | "C" | "D" | "E" | "F";
type Join<A extends C[]> = A extends [infer H extends C, ...infer R extends C[]] ? `${H}${Join<R>}` : "";
type Group<N extends number, A extends C[] = []> = A["length"] extends N ? `${Join<A>}${End}` : Group<N, [...A, C]>;
type Shape = `${Group<8>}-${Group<4>}-${Group<4>}-${Group<4>}-${Group<12>}`; // 8-4-4-4-12 characters
type Digits<S extends string> = S extends `${infer A}-${infer B}-${infer C}-${infer D}-${infer E}` ? `${A}${B}${C}${D}${E}` : "-";
type AllHex<S extends string> = S extends `${Hex}${infer R}` ? AllHex<R> : S extends "" ? true : false;

declare function uuid<S extends string>(id: S extends Shape ? AllHex<Digits<S>> extends true ? S : never : never): void;

uuid("123e4567-e89b-12d3-a456-426614174000");
uuid("123E4567-E89B-12D3-A456-426614174000");
// @ts-expect-error z isn't hex
uuid("123e4567-e89b-12d3-a456-42661417400z");
// @ts-expect-error last group too short
uuid("123e4567-e89b-12d3-a456-42661417400");
// @ts-expect-error dashes in the wrong place
uuid("123e4567e-89b-12d3-a456-426614174000");
// @ts-expect-error extra dash inside a group
uuid("123e4567-e89b-12d3-a456--26614174000");
```

[Open in TS Playground][playground]

## How it works

- `Group<N>` builds `N` of the one-character placeholders from [exact-length](../exact-length) followed by `End`, so `Group<4>` is `` `${C}${C}${C}${C}${End}` ``. `End` (`"" & String`) only works right before a literal or at the very end, so each group ends just before its `-`.
- `Shape` puts five groups together with dashes, which fixes the length of each group.
- `Digits` splits the UUID on its four dashes and joins the groups back up. `AllHex` then checks every character against `Hex`. A fifth dash ends up in the last group, where `AllHex` rejects it.

Why a function and not a type? Like [hex-color](../hex-color), a type listing every hex digit in each position would be far over TypeScript's limit of 100,000 combinations.

## Limits

- It checks the format only. The version digit (the first character of the third group) and the variant aren't checked, so `123e4567-e89b-92d3-…` passes.
- No braces (`{…}`), `urn:uuid:` prefix, or UUIDs without dashes.
- The argument has to be a string literal. A value typed as `string` is rejected.

[playground]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbgChRIoBhFKAZ0JNOygG8BfKm6ABIQAHozQAGTAB90ARmnoATArQBmFQBYVAVhUA2FQHYVADhUBOFQEMVAIxUBjFQhUQVAMxUBBFQCEVdCoAIiowKgBiaHzg0ABSAPYkADxeUCLAEIhM9ADaALoAfIyp6ZkI2Tkk7hAEUAJpwhlZ9AA0UAB0nVU1UABKDU3luXl5UAD8UAAGACScAtyzCcm9BdyTUABc6FHUMVAA4gTxAK5gSQByA2XZcMcAtrY1bSWN18OM+UWoXjloADaZUjAAAWaFGpWalwmM04SzgKVWs3gCDWmwOR1OFzaOU67S8bTohWitFwwKstFQMMOJzOJlWAFpZtTMRoGUyMWdWdxGZxmZy2byOUlZIpVpNyFAAPSSqAmekaeWKkVQBxkghWBwZAhMXa0IJEUhEYBMJK4K7NFjEMhfPDmoYw7q1Lzc2aOqC+F2cN10T1uoK+uDVWowVHQ2bO2Ye2Y+2b+pGorZoek7fhQLx-P5CYSmu3ZS1sG1miH22ZZhZewM9XqhtMZrNJFZoouvZoYcZQQjHaBbdxWP5MCBUSgICAOP5WAjQdzHOCaojxOBQY7HIgIHPFvOsa0AClXW2bg2ypPJ0Am6czIiS+sNxtNBSKG47BC77bNWzgEAAbj131+agBKLZP0SBAh2XVdtzQEVVAgDRtD0Qx6QgExzFsekRQQVR6SsOC9HlRQ9D0WQNFkQwNHECi0H-KhwIQSDoJgXDEJgFDfHQxQgiwrxcPwwjiNI8jKOoyhpSgAABY0kOESBNSQggjlqAAvKAiCYOAAHJgCgYEREoWj6MUGCmKQlC0IwrCcPg3iiJIsiKMUqiqFEiSmCkmTgDkhSoHHFgoFIDkO3ieJmGBeICGAPSVzoqDDNg+DEOQ1D2Mw7CeI0AibIEoSnJlFy3NHDyai8hArCYHTshIDsdKgAB3I4yCgMBxwcCBIogmKjPiiB6VM5KLLSjL+Ls7KRNyySRHczywoGdUoBKsqVLgJhV2gKw-I5NrouguKEJMpLzNSqz6UG2zBMkYSgA
