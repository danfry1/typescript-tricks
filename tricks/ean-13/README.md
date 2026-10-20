# ean-13

A function parameter that only accepts 13-digit barcodes (EAN-13, which includes ISBN-13) with a valid check digit.

```ts
type End = "" & String;
type D = bigint & {};
type Thrice = ["0", "3", "6", "9", "12", "15", "18", "21", "24", "27"];
type Digit = keyof Thrice & `${number}`;
type Thirteen = `${D}${D}${D}${D}${D}${D}${D}${D}${D}${D}${D}${D}${D}${End}`;
type Rep<N extends string, A extends 0[] = []> = `${A["length"]}` extends N ? A : Rep<N, [...A, 0]>;
type Rev<S extends string, A extends string = ""> = S extends `${infer H}${infer R}` ? Rev<R, `${H}${A}`> : A;
type Ean<S extends string, Sum extends unknown[] = [], Triple = false> =
  S extends `${infer H extends Digit}${infer R}`
    ? Ean<R, [...Sum, ...Rep<Triple extends true ? Thrice[H] : H>], Triple extends true ? false : true>
    : S extends "" ? `${Sum["length"]}` extends `${string}0` ? true : false : false;

declare function barcode<S extends string>(code: S extends Thirteen ? Ean<Rev<S>> extends true ? S : never : never): void;

barcode("4006381333931");
barcode("9780306406157"); // ISBN-13
// @ts-expect-error wrong check digit
barcode("4006381333932");
// @ts-expect-error 12 digits
barcode("400638133393");
```

[Open in TS Playground][playground]

## How it works

- `Thirteen` is the [exact-length](../exact-length) pattern with 13 digit placeholders, so the code has to be exactly 13 digits.
- `Rev` reverses the string so the check digit comes first. `Ean` then walks the digits, weighting them 1, 3, 1, 3, … from the right.
- `Thrice` is a lookup table of each digit times 3. `Rep` turns each weighted digit into a tuple of that many elements and adds them all to `Sum`, so the running total is just the tuple's length.
- The code passes if `` `${Sum["length"]}` `` ends in `0`.

This follows the same approach as [luhn](../luhn), with different weights. An earlier version spread the digit's tuple three times instead of using `Thrice`, and that failed with `TS2321: Excessive stack depth`.

## Limits

- The argument has to be a string literal. A value typed as `string` is rejected.
- Only EAN-13. Not EAN-8, UPC-A (12 digits) or ISBN-10.
- Only digits. Spaces or dashes (`978-0-306-40615-7`) are rejected.

[playground]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbgChRIoARFKAIyNJOGygG8BfKm6ABUAFsQDG0VAG00ABjQAadAGZF6AGxq0ATi0BGAEz6ArPoAcWg3ssAWSwHY0AXX7hodVkQ6oA1hBAA9gBmUCLi0DgABgAkXHAArgC2TBAEPJGutCJEBMAQEHCMMVx0PLGl5WUlVRXVlfV1jbXNVfAI6ZnQAEoQYAA8AHJQEAAeeYgAzlAThCSkSgCCw2MFCFOyUk6MmwB8RbELMgA2BaTAws7py+NrUEMA-FBLAFxQPf0DSlIAdL8LSrInDtOm8IAA3Pq4a6rKYzYhkRbQybTWZkRgYPaoKGjG5TYokIKpKAACSqBKJXSujx6EK6SmKpIO6T2rwWIJgAEM4JCkbc4XMlLgkrypvE4D44AEAO5wTbbJxKQTEMAnRhBDlHCYQTGUKB4EVQfFwQkEEkGjxsYBk40U9K6vVQR6c7l0qA-X5CxJKX7fd59JVEFXQHEwqCEeLQR5hIgSKTEravYk7BWhZWqkPI8ORqDqzXQV5Znb2vWvbErZEYR2G2Ke46nc6XSIG4r8sg8WRNx5ZqCvXNans5jVaqiUBAQMRHDkEaBBMViYBEAKFJhTsQBMc8jN81GkHYACjXY9LBuyuXyhSdXL6NMhOz2W6m3ceUNecHBRNf74IAEpXmCAkQCAjiuBCHhAe5oDYsiyOoyhmHoyiIdoyjWN+VAgWBEHaPYZiyMoMFQeoejGI4aFQAA9ORUAAJK4AAQgMAC0CGUJRUAAALABMjGjJA848QQBABKaUpCWiYjCOOPhQAgnjAJQGHruBkHQbB8GIcoyFGGhrFUZx3G8eOwACUJpqGDJckTApq5KRBUEwXBCFIaoOlAA
