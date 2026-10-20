# semver

A string type for `MAJOR.MINOR.PATCH` versions, with an optional `-prerelease` suffix and no leading zeros.

```ts
type N = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Part = "0" | (`${bigint}` & `${N}${string}`);
type SemVer = `${Part}.${Part}.${Part}` | `${Part}.${Part}.${Part}-${string & {}}${string}`;

const a: SemVer = "1.2.3";
const b: SemVer = "10.0.0-beta.1";
// @ts-expect-error leading zero
const c: SemVer = "1.02.3";
// @ts-expect-error
const d: SemVer = "1.2.3.4";
// @ts-expect-error
const e: SemVer = "1.2.x";
```

[Open in TS Playground][playground]

## How it works

- `Part` is either `"0"`, or a string that is both a valid `bigint` (`` `${bigint}` ``) and starts with a digit from 1 to 9 (`` `${N}${string}` ``). Combining the two rules out leading zeros, signs, decimals and letters.
- The prerelease branch requires `-` followed by at least one character (`` `${string & {}}${string}` ``).

## Limits

- Build metadata (`1.2.3+build.5`) isn't supported.
- Prerelease text isn't checked: anything goes after the `-` as long as it isn't empty (e.g. `1.2.3-beta..1` is accepted).

[playground]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAclC8UBEBGJUA+yBM6tIGY9kAWYpAVnIDZyB2cgDnIE4kBuAKFEigAUAhgCdgCZAAZiACgAGAEgDeAIwCWAcxUA7YAF8ZUAGRR5CmDsUBnYEK1q9ASi49oAZQgBbAGoQhYk4JEdADpFAN0QhTC9TGNQ4XC4wIiogFpLa1tDKAUdcwUrG007GS5OAGMAe00rKAEALig3Lx8xVCDsIKIuSurRJQam719EVHEgsfEUpQhgASC0LgB6RagAAWALFIgAD0gy4C2hIQrfABsIAQATTIAvHwryqpqygY8h1pRxjq7OZbWNra7CD7Q7HISPXpQS6vZrDZCfb5BMhLFbrTY7PYHHxgiE1CAw94jBFBbYcThAA
