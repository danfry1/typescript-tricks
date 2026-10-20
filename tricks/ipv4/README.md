# ipv4

A function parameter that only accepts IPv4 addresses, with each part from 0 to 255 and no leading zeros.

```ts
type End = "" & String;
type D = bigint & {};
type N = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Octet =
  | `${D}${End}`                                // 0-9
  | `${N}${D}${End}`                            // 10-99
  | `1${D}${D}${End}`                           // 100-199
  | `2${"0" | "1" | "2" | "3" | "4"}${D}${End}` // 200-249
  | `25${"0" | "1" | "2" | "3" | "4" | "5"}`;   // 250-255

declare function ip<S extends string>(
  address: S extends `${infer W}.${infer X}.${infer Y}.${infer Z}`
    ? [W, X, Y, Z] extends [Octet, Octet, Octet, Octet] ? S : never
    : never,
): void;

ip("192.168.0.1");
ip("255.255.255.255");
// @ts-expect-error 256 is out of range
ip("256.0.0.1");
// @ts-expect-error leading zero
ip("01.2.3.4");
// @ts-expect-error too few parts
ip("1.2.3");
// @ts-expect-error too many parts
ip("1.2.3.4.5");
```

[Open in TS Playground][playground]

## How it works

- `Octet` covers 0 to 255 in five patterns, one per range, using the same digit placeholders as [port-range](../port-range). `End` (`"" & String`) goes after each digit pattern so a part can't run on past its last digit.
- `ip` splits the address on `.` into exactly four parts with `infer`, then checks all four against `Octet` at once as a tuple.

Why not a plain `` `${Octet}.${Octet}.${Octet}.${Octet}` `` type? `Octet` expands to 22 patterns, so four of them make 22⁴ ≈ 234,000 combinations. That's over TypeScript's limit of 100,000, so it fails with `TS2590: Expression produces a union type that is too complex to represent`. Checking each part on its own never builds those combinations.

## Limits

- It's a function parameter, not a type you can put on a variable (`const a: IPv4`), because of the combination limit above.
- The argument has to be a string literal. A value typed as `string` is rejected.
- IPv4 only. No IPv6, and no CIDR suffix like `/24`.

[playground]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbgChRIoARFKAIyNJOGygG8BfKm6ADlGaAIyYAPugBMk9AGY5aACxKArEoBsSgOxKAHEoCcafuGgB5AMbAIHZJShQpAAwAkXOjw-wEPF06BQcEhocEA9OFQAAwAtEaOzlDuXILenum+-mE5uVCRUKJxRglOrqIeXpWZiNl59YEFRXGiJYmu0h5o0UriSWiy-Yr9qulVXFkBBdLRcdLKpUku0mpdPf19UgNKw1uq-Rr+5I1RK3NqapSUCBBWADYAhgTQAGYArnA2RAD2cFBEYAAPLgoBAAB62RAAZygUMIJFIAD4ABSJB4IBDPKFQgBceFBEIg0OSHhILwgBCgAHUeAA6UlwcmUgAadIZTKgAE02VwyRSoAAtfyJJwAfigAG0qQAaKDM2Wc2UCgC6BMhCBhEustmAsu1dj1NgNUH1wFV4pBeLgEAAbhSRVArbaKdLKABKPE275EBBUSgA5FiIzSWmiTT6WnRUNoN1UAMDC60lZqJOJ5MxqgFAACwChsXBkBs+YIBG+lJWmn+MO+bw43xeUAIDzIEH9YEDFcjXfEsco2dz+bBheAxdLlLuEHRCKgAC8Kd824HoqIk7T5LTVL3+3mC7cRxSx1BgN9vlByQB3KBgJ65xdiVeKLdRHM7od70dlo8nqAAW2bICvG8oTvFcQ3XZRaQ0XsgA
