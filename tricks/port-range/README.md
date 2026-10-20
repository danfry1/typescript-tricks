# port-range

A function parameter that only accepts number literals from 1 to 65535.

```ts
type End = "" & String;
type D = bigint & {};
type N = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Port =
  | `${N}${End}` | `${N}${D}${End}` | `${N}${D}${D}${End}` | `${N}${D}${D}${D}${End}`
  | `${"1" | "2" | "3" | "4" | "5"}${D}${D}${D}${D}${End}`
  | `6${"0" | "1" | "2" | "3" | "4"}${D}${D}${D}${End}`
  | `65${"0" | "1" | "2" | "3" | "4"}${D}${D}${End}`
  | `655${"0" | "1" | "2"}${D}${End}`
  | `6553${"0" | "1" | "2" | "3" | "4" | "5"}`;

declare function listen<P extends number>(port: `${P}` extends Port ? P : never): void;

listen(3000);
listen(65535);
// @ts-expect-error
listen(65536);
// @ts-expect-error
listen(0);
```

[Open in TS Playground][playground]

## How it works

`listen` captures the argument as a number literal type `P` and turns it into a string with `` `${P}` ``. The parameter type is `P` if that string matches `Port`, and `never` if it doesn't.

`Port` works through the range one digit at a time:

- `N` is a digit from 1 to 9, so there are no leading zeros.
- `D` (`bigint & {}`) is any single digit.
- `End` (`"" & String`) means nothing can come after the last digit.
- Numbers with 1 to 4 digits are always allowed. Five-digit numbers have one branch per prefix (`1`–`5`, `60`–`64`, `650`–`654`, `6550`–`6552`, `65530`–`65535`) to keep them at or under 65535.

## Limits

- The argument has to be a number literal. A value typed as `number` is rejected, because its value isn't known at compile time.
- Decimals (`80.5`), negative numbers and `0` are rejected.

[playground]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbgChRIoARFKAIyNJOGygG8BfKm6ADlGaAIyYAPugBMk9AGY5aACxKArEoBsSgOxKAHEoCcafuGgAFAPYEOySlChSABgBIugnu-gIezp1BuHl5cdCE+fgFBnu5hseGIkS7uMaEhcWneic4OUe5iSrIBaIrFqsUa6VXxNVwROY4umvkADErixUVSJUqq1ZkD9blNaq3thUql3X21GUONgZpqo1xobcUd3bL981FLavJjGxPFU+jl3ZXOVJQIEADGADYAhgTQAGYArnD3wERWcCgjyIAGdgBA4AAeCxQCAAD3BiBBUDgnwAtkwIAQAHwACjANmAAC5Au4LJF4YiEMjrLYoAB+KAwklwCAANyxAEoSWyrEQEDdgWCIbj5C1xZyqELEbj9vI1JLKAB6JVQAACwBBAFp4ZBfjqCAQbJRpSK5ZpFSr1ZqdXC9cADUaCCbQTKWoqgA
