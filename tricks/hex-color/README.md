# hex-color

A function parameter that only accepts CSS hex colours: `#` and then 3, 4, 6 or 8 hex digits.

```ts
type End = "" & String;
type C = string & {};
type Hex = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a" | "b" | "c" | "d" | "e" | "f" | "A" | "B" | "C" | "D" | "E" | "F";
type Shape = // # then 3, 4, 6 or 8 characters
  | `#${C}${C}${C}${End}`
  | `#${C}${C}${C}${C}${End}`
  | `#${C}${C}${C}${C}${C}${C}${End}`
  | `#${C}${C}${C}${C}${C}${C}${C}${C}${End}`;
type AllHex<S extends string> = S extends `${Hex}${infer R}` ? AllHex<R> : S extends "" ? true : false;

declare function color<S extends string>(
  c: S extends Shape ? S extends `#${infer B}` ? AllHex<B> extends true ? S : never : never : never,
): void;

color("#fff");
color("#1a2B3c");
color("#1a2b3c80");
// @ts-expect-error g isn't hex
color("#ggg");
// @ts-expect-error 5 digits
color("#12345");
// @ts-expect-error missing #
color("1a2b3c");
```

[Open in TS Playground][playground]

## How it works

- `Shape` uses the placeholders from [exact-length](../exact-length) to allow exactly 3, 4, 6 or 8 characters after `#`. `C` (`string & {}`) matches one character, and `End` (`"" & String`) stops the last one from soaking up the rest.
- `AllHex` then checks those characters one at a time against `Hex`, the 22 hex digits in either case.
- `color` only keeps the argument's type if both checks pass. Otherwise the parameter becomes `never`, and the call fails.

Why not a plain `` `#${Hex}${Hex}${Hex}${Hex}${Hex}${Hex}` `` type? With 22 options in each of 6 places, that's 22⁶ ≈ 113 million combinations, far over TypeScript's limit of 100,000 (`TS2590`). Checking the shape and the digits separately never builds those combinations.

## Limits

- It's a function parameter, not a type you can put on a variable (`const c: HexColor`), because of the combination limit above.
- The argument has to be a string literal. A value typed as `string` is rejected.
- Hex only. No `rgb()`, `hsl()` or named colours like `red`.

[playground]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbgChRIoBhFKAZ0JNOygG8BfKm6ABIQAHozQAGTAB90ARmnoATArQBmFQBYVAVhUA2FQHYVADhUBOFQEMVAIxUBjFQhUQVAMxUBBFQCEVdCoAIiowKgBiaHzg0LgAFla0qAD0yVAAxFDAcRBwUKoANFAaRXpQAPYEUCZQDgkEVg7AEARMlFBQMgAG6QAknHTc-YPDQ5zwCNxd7Z1QPaMLA2Mj44hTM919S4sru8tjE+sdmzv7p+fbq5Nd0bReADb3QsIAPLhQIs2ITMysZAB8jHen1yCB+XX6zzGJHcLSgACUplAAPxQB5PEQveGAgBceA+wi+YPQmFRhAArtA8e4rPcmBAqJQEBAHPcrARoO5yXAmkRynkHOV7pU3gSiT8WMQAQAKGYOPHAwmgn7xRLQVGK8VzLYwuG+JGo9HPF6+QEg75ZAiUlH4vFwCAANzhdsdzqg9qdBAKlAAlHiHeUiAhGYLhQRpWh0u5o2gfVRQ5UI+lZFZFL5VE445QE+HIynFLYMyZJFnUlAAALAJgAWhEkCatYIBEqUHYRCYcAA5MAoDlhNmhYnI6QR7GqGXKzW6yzgI3m1VtFAEERSEQqwOw0nZIpVBpdKW0pPa8J67OWvOoABbdtMNgZDdD-OFzNUIA
