# luhn

A function parameter that only accepts digit strings that pass the Luhn checksum, which is used for credit card numbers.

```ts
type Twice = ["0", "2", "4", "6", "8", "1", "3", "5", "7", "9"];
type Digit = keyof Twice & `${number}`;
type Rep<N extends string, A extends 0[] = []> = `${A["length"]}` extends N ? A : Rep<N, [...A, 0]>;
type Rev<S extends string, A extends string = ""> = S extends `${infer H}${infer R}` ? Rev<R, `${H}${A}`> : A extends "" ? "!" : A;
type Luhn<S extends string, Sum extends unknown[] = [], Dbl = false> =
  S extends `${infer H extends Digit}${infer R}`
    ? Luhn<R, [...Sum, ...Rep<Dbl extends true ? Twice[H] : H>], Dbl extends true ? false : true>
    : S extends "" ? `${Sum["length"]}` extends `${string}0` ? true : false : false;

declare function card<S extends string>(n: Luhn<Rev<S>> extends true ? S : never): void;

card("4242424242424242");
// @ts-expect-error one digit off
card("4242424242424241");
```

[Open in TS Playground][playground]

## How it works

- `Rev` reverses the string, because the Luhn check starts from the rightmost digit. An empty input becomes `"!"`, so it fails.
- `Luhn` steps through the reversed digits, doubling every second one. `Twice` is a lookup table holding the digit sum of each doubled digit (e.g. `7 → 14 → 5`).
- `Rep` turns each digit into a tuple of that many elements and adds them all to `Sum`, so the running total is just the tuple's length.
- The number passes if `` `${Sum["length"]}` `` ends in `0`.

## Limits

- The argument has to be a string literal. A value typed as `string` is rejected.
- Only digits are allowed. Spaces or dashes (`4242 4242 …`) are rejected.
- Tested up to 19 digits, the longest card number length. The work done by the type checker grows with the length of the input.

[playground]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAKg7gSwMbQLxQNoCIAMWA0UWATAUQCxlYBsVAHFQIxUDMVArFQOxUCcWAXQDcAKFCQoAEQQBzBMCjoA1hBAB7AGaxEKKADIoAAwAkAbwB2AVwC2AIwgAnAL6HR46ACUIYADwA5KAgAD2AIcwATAGcoSOAHBHMZQgBBQJCwqKgcDAFFTAEAPjyTU2TsABswmWAAC0EXNNCI6ICAfihUgC4oL18-QgwAOmHkwhxCt3BPCAA3HwBlRozo2PjElKXmmLiEmTysLCL0ReCmzJKEjUcoAAknM0vrjwb2rzmPQhK7s2SXIu7UqdlkQsFB2lgAISggGTCQAGUsNXMC02mVWu0I8xsqOilnMSnMajg5hyeRyhEktnKeQ0AENypEIEcRFAoCd0lsLuYrg5bjipLJ5PdTI9ec9DCzWWCoAikT4PphhoMsdZCErej5KdSgVs4pZoO14MgIBgbrlujcCgIKVT+XqDVA6QzoN17QVJazuuyztEDtKSiqKlVavVDPySujEk4cGH2vaoN0nYyE476YzRCJwhAkOVaQ5oBo8UhgAg1OYoEg8+EUTq0TtEgUABTmbqy5FvBYFIq16Lx9qLbrmWaOACU3RmagQ4QzlYc4UbWHIxCXK+Xa9XWBHogA9NuoAABYCRAC0wUgxdPDgcal5Zeg4UFCk0GhEs-ni-Xn9X5GYW5EQA
