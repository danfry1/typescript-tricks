<p align="center"><img src="assets/icon.svg" width="96" height="96" alt=""></p>

# typescript-tricks

Compile-time TypeScript tricks with no runtime code and no branded types. Every trick is checked by the compiler.

Each trick lives in `tricks/<name>/`. `index.ts` has the trick, cases that should pass, and cases that should fail. `README.md` explains how it works and where it stops working. The failing cases are marked with `// @ts-expect-error`, and TypeScript reports an error if one of those lines doesn't actually fail. So if the check passes, every case behaves as shown.

## Tricks

### [exact-length](tricks/exact-length)

Strings with an exact length, e.g. a 3-character country code or a 4-digit PIN. · [Playground][exact-length]

```ts
type Pin = `${D}${D}${D}${D}${End}`;    // exactly 4 digits

const pin: Pin = "0427";
// @ts-expect-error not a digit
const letter: Pin = "04a7";
```

### [min-max-length](tricks/min-max-length)

Strings between a minimum and maximum length. · [Playground][min-max-length]

```ts
type Username = `${C}${C}${C}${O}${O}${O}${O}${O}${End}`; // 3 to 8 characters

const b: Username = "danfry";
// @ts-expect-error too long
const d: Username = "danfrydev1";
```

### [currency-code](tricks/currency-code)

3-letter uppercase codes like `GBP`, using `Uppercase<string>` as a type. · [Playground][currency-code]

```ts
type CurrencyCode = Uppercase<string> & `${C}${C}${C}${End}`; // 3 uppercase characters

const gbp: CurrencyCode = "GBP";
// @ts-expect-error lowercase
const lower: CurrencyCode = "gbp";
```

### [port-range](tricks/port-range)

Number literals from 1 to 65535. · [Playground][port-range]

```ts
listen(65535);
// @ts-expect-error
listen(65536);
```

### [ipv4](tricks/ipv4)

IPv4 addresses with each part from 0 to 255. · [Playground][ipv4]

```ts
ip("192.168.0.1");
// @ts-expect-error 256 is out of range
ip("256.0.0.1");
```

### [semver](tricks/semver)

`MAJOR.MINOR.PATCH[-prerelease]` with no leading zeros. · [Playground][semver]

```ts
const b: SemVer = "10.0.0-beta.1";
// @ts-expect-error leading zero
const c: SemVer = "1.02.3";
```

### [iso-date](tricks/iso-date)

`YYYY-MM-DD` with the right number of days in each month, including leap years. · [Playground][iso-date]

```ts
const ok: IsoDate[] = ["2026-10-20", "2028-02-29", "2000-02-29"];
// @ts-expect-error
const b: IsoDate = "1900-02-29";
```

### [luhn](tricks/luhn)

Digit strings that pass the Luhn checksum (credit card numbers). · [Playground][luhn]

```ts
card("4242424242424242");
// @ts-expect-error one digit off
card("4242424242424241");
```

### [ean-13](tricks/ean-13)

13-digit barcodes (EAN-13 and ISBN-13) with a valid check digit. · [Playground][ean-13]

```ts
barcode("9780306406157"); // ISBN-13
// @ts-expect-error wrong check digit
barcode("4006381333932");
```

### [hex-color](tricks/hex-color)

CSS hex colours like `#fff` or `#1a2b3c80`. · [Playground][hex-color]

```ts
color("#1a2B3c");
// @ts-expect-error g isn't hex
color("#ggg");
```

### [uuid](tricks/uuid)

UUIDs in the 8-4-4-4-12 hex format. · [Playground][uuid]

```ts
uuid("123e4567-e89b-12d3-a456-426614174000");
// @ts-expect-error z isn't hex
uuid("123e4567-e89b-12d3-a456-42661417400z");
```

### [printf](tricks/printf)

A `format` function whose arguments are typed from its format string. · [Playground][printf]

```ts
format("%s is %d years old", "Dan", 31);
// @ts-expect-error %d needs a number
format("%s is %d years old", "Dan", "31");
```

### [xor-props](tricks/xor-props)

Props that need one of two options but not both, like `href` or `onClick`. · [Playground][xor-props]

```ts
type ButtonProps = { label: string } & Xor<{ href: string }, { onClick: () => void }>;

// @ts-expect-error both href and onClick
const both: ButtonProps = { label: "Huh", href: "/docs", onClick: () => {} };
```

## Verified

Every file compiles under `tsc --strict --noEmit`. CI runs the check on TypeScript 7.0.2 and 5.9.3.

```sh
pnpm install
pnpm check
```

The repo scripts are TypeScript too, and run directly on Node 24 or later with no build step. `pnpm check` type-checks them first.

Each trick is checked in its own `tsc` run, because the tricks are standalone scripts that reuse type names like `End`, `D` and `N`.

`pnpm check` also checks that the docs match the code. Every playground link has to decode back to its `index.ts`, every trick README has to embed its `index.ts`, and every line of the snippets above has to appear in the trick's `index.ts`. After editing a trick, run `pnpm docs:sync` to regenerate the links and embedded code.

## Contributing

New tricks are welcome. Each one needs to:

- work at the type level only, with no runtime logic and no branded types. Test cases can be `const` assignments and calls to `declare`d functions;
- live in its own `tricks/<name>/` folder, as an `index.ts` and a `README.md`;
- show cases that should pass, and cases that should fail marked with `// @ts-expect-error`;
- pass `pnpm check` on both TypeScript 7.0.2 and 5.9.3.

The trick's `README.md` needs a one-line description, an empty `ts` code block, `[Open in TS Playground][playground]`, a short "How it works", and "Limits". Use an existing trick as a template. Add a `### [<name>](tricks/<name>)` section to this README with a few lines copied from `index.ts`, then run `pnpm docs:sync` to fill in the code and playground links.

## License

[MIT](LICENSE)

[exact-length]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbigHoqoBDKMAGzoGMIALAeyYQgKjAOdYFC5wmIKAFsRrDhADO6NAChQkKAGEUURYRKlsUAN4BfSlGq0GzNpx58BQkTLkLl46PLoE2wfnVwaAARXQAjIlISURxzS2t6RhZ2bl5+QWFRWWB5JTE4aAQoomBVIM0tLgBXOEIpVAADABITLTNW9s6Ok3gEM0aExIgAD39JKABmKB8-VgCCRQroAAUSXRaTEJ7t1t2tnr6BoZooUfGpABYoYujgJdVWcX0oUnCCAC5tGrqCBvQAOIAIQASmhyKpTgABe4AWlGkHm8IIBC4zi4XD03AIZSecBe1QA1l8qrV6ro0ABVADS4Mez1EYBIXzWcApAAZLgAmADsdOhcIRECR-FR6MximxuIZWLRwBZ61QaE5XP5tBhinhI0RwGRYqgcC4ogYt1K9PxoiYEGACwVbKVnLofIhQA
[min-max-length]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbigHoqoB7OAGxCgFsBDYAYwAsIBndGgBQoSFADCKKP0IlS2KAG8AvpSjVaEAB7suwZvTjRe7AnuAQCo8NADy0qQB8h6je81GTPMxasAaegIoODpgHnlhG3EAVX4rOHZWaFQAAwASJQkVTOzcnKU7AqLMksLigvgEFVTKGigAZihgOigADihTc30rfiiuBlkodgAuKDiEpJT0BHY4NHJhAbghgCMxiYJE5Ok0WbgAMwIQBeF6gAFgfgBaHUh9W4ICOmCW1v4eF+AlweBOjfiWymuwQpFOFyut2092Aj2erzorUYDFIPxWfwQAMmO1QezmRxACAgADcAIynIA
[currency-code]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbgChRIoBhFKAZ0JNOygG8BfK68aHQCuBAhDgBjEHQD2CaKgCqYSAQkBDJhAA8LYmQB8HAAYASTnW7nL1q53gJux8lAD0rqAGYoQlRDWa0BIAFuoE6hLA-kyUlBIycCxQpABGYABc9CJiktJyCugA4gBCAApoVPGJwD5MCJnCouJSsvKMaIq4ACIVlO5QAALATAC0EAAekJFjojIEUAA2MgDu-hpacQlJS6sEDdnNeW2oaKlgvf1DoxNTwDMEc1DAMjKLCaSb1W9k+025rQU0CVSgANXpAA
[port-range]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbgChRIoARFKAIyNJOGygG8BfKm6ADlGaAIyYAPugBMk9AGY5aACxKArEoBsSgOxKAHEoCcafuGgAFAPYEOySlChSABgBIugnu-gIezp1BuHl5cdCE+fgFBnu5hseGIkS7uMaEhcWneic4OUe5iSrIBaIrFqsUa6VXxNVwROY4umvkADErixUVSJUqq1ZkD9blNaq3thUql3X21GUONgZpqo1xobcUd3bL981FLavJjGxPFU+jl3ZXOVJQIEADGADYAhgTQAGYArnD3wERWcCgjyIAGdgBA4AAeCxQCAAD3BiBBUDgnwAtkwIAQAHwACjANmAAC5Au4LJF4YiEMjrLYoAB+KAwklwCAANyxAEoSWyrEQEDdgWCIbj5C1xZyqELEbj9vI1JLKAB6JVQAACwBBAFp4ZBfjqCAQbJRpSK5ZpFSr1ZqdXC9cADUaCCbQTKWoqgA
[ipv4]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbgChRIoARFKAIyNJOGygG8BfKm6ADlGaAIyYAPugBMk9AGY5aACxKArEoBsSgOxKAHEoCcafuGgB5AMbAIHZJShQpAAwAkXOjw-wEPF06BQcEhocEA9OFQAAwAtEaOzlDuXILenum+-mE5uVCRUKJxRglOrqIeXpWZiNl59YEFRXGiJYmu0h5o0UriSWiy-Yr9qulVXFkBBdLRcdLKpUku0mpdPf19UgNKw1uq-Rr+5I1RK3NqapSUCBBWADYAhgTQAGYArnA2RAD2cFBEYAAPLgoBAAB62RAAZygUMIJFIAD4ABSJB4IBDPKFQgBceFBEIg0OSHhILwgBCgAHUeAA6UlwcmUgAadIZTKgAE02VwyRSoAAtfyJJwAfigAG0qQAaKDM2Wc2UCgC6BMhCBhEustmAsu1dj1NgNUH1wFV4pBeLgEAAbhSRVArbaKdLKABKPE275EBBUSgA5FiIzSWmiTT6WnRUNoN1UAMDC60lZqJOJ5MxqgFAACwChsXBkBs+YIBG+lJWmn+MO+bw43xeUAIDzIEH9YEDFcjXfEsco2dz+bBheAxdLlLuEHRCKgAC8Kd824HoqIk7T5LTVL3+3mC7cRxSx1BgN9vlByQB3KBgJ65xdiVeKLdRHM7od70dlo8nqAAW2bICvG8oTvFcQ3XZRaQ0XsgA
[semver]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAclC8UBEBGJUA+yBM6tIGY9kAWYpAVnIDZyB2cgDnIE4kBuAKFEigAUAhgCdgCZAAZiACgAGAEgDeAIwCWAcxUA7YAF8ZUAGRR5CmDsUBnYEK1q9ASi49oAZQgBbAGoQhYk4JEdADpFAN0QhTC9TGNQ4XC4wIiogFpLa1tDKAUdcwUrG007GS5OAGMAe00rKAEALig3Lx8xVCDsIKIuSurRJQam719EVHEgsfEUpQhgASC0LgB6RagAAWALFIgAD0gy4C2hIQrfABsIAQATTIAvHwryqpqygY8h1pRxjq7OZbWNra7CD7Q7HISPXpQS6vZrDZCfb5BMhLFbrTY7PYHHxgiE1CAw94jBFBbYcThAA
[iso-date]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbgChRIoARFKAIyNJOGygG8BfKm6ADlGaAIyYAPugBMk9AGY5aACxKArEoBsSgOxKAHEoCcafuGh0AhiEYADAAwASLoJ62oU26Od03HqLbSzjAAHgDGADYArggQADyCADToJgB8-mj2aG5mtACadj48RSVcvsGIOdTmUACKIvZZGfaqzYYZorId2hnSTVJo0q0D0u0D8l3jPQPK-ejKw-OGlFAZapPoatPomnNomov7Y+g6G2g622j6e-qH+sdoRmdG2lTVtACSAM4A9lbA0GQK38tmceR4AFpnJlxM1FM0NM09G0lKI9p1slCytZeiYMvI9vJxMUuPAEG5gZ4wZDoS0lPZLvY8QNRMSsVYbCNmQosiSyRTVlSuOCIfZpOzrHzKrZKQFSuVSeForE4rVkpksqlIWKIdIjO4hbUeI1ReK9bY3mEfnAvhwfgBrABcUG+f0sAIA2gBdRgewZizQQtG6rLqvqjU26kxhxr2SN6tBeqgAemTUAAAsAvhCICFIGFgDmCAQfgRKFabRxLM7Xf9ATIA-GTCm05ns7n84WIMXS+XrbbmDXfnWRKIjCadQmWxmszm8xAC0WS2WKwOwkO3QCROHAy0IUTTJQgA
[luhn]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAKg7gSwMbQLxQNoCIAMWA0UWATAUQCxlYBsVAHFQIxUDMVArFQOxUCcWAXQDcAKFCQoAEQQBzBMCjoA1hBAB7AGaxEKKADIoAAwAkAbwB2AVwC2AIwgAnAL6HR46ACUIYADwA5KAgAD2AIcwATAGcoSOAHBHMZQgBBQJCwqKgcDAFFTAEAPjyTU2TsABswmWAAC0EXNNCI6ICAfihUgC4oL18-QgwAOmHkwhxCt3BPCAA3HwBlRozo2PjElKXmmLiEmTysLCL0ReCmzJKEjUcoAAknM0vrjwb2rzmPQhK7s2SXIu7UqdlkQsFB2lgAISggGTCQAGUsNXMC02mVWu0I8xsqOilnMSnMajg5hyeRyhEktnKeQ0AENypEIEcRFAoCd0lsLuYrg5bjipLJ5PdTI9ec9DCzWWCoAikT4PphhoMsdZCErej5KdSgVs4pZoO14MgIBgbrlujcCgIKVT+XqDVA6QzoN17QVJazuuyztEDtKSiqKlVavVDPySujEk4cGH2vaoN0nYyE476YzRCJwhAkOVaQ5oBo8UhgAg1OYoEg8+EUTq0TtEgUABTmbqy5FvBYFIq16Lx9qLbrmWaOACU3RmagQ4QzlYc4UbWHIxCXK+Xa9XWBHogA9NuoAABYCRAC0wUgxdPDgcal5Zeg4UFCk0GhEs-ni-Xn9X5GYW5EQA
[ean-13]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbgChRIoARFKAIyNJOGygG8BfKm6ABUAFsQDG0VAG00ABjQAadAGZF6AGxq0ATi0BGAEz6ArPoAcWg3ssAWSwHY0AXX7hodVkQ6oA1hBAA9gBmUCLi0DgABgAkXHAArgC2TBAEPJGutCJEBMAQEHCMMVx0PLGl5WUlVRXVlfV1jbXNVfAI6ZnQAEoQYAA8AHJQEAAeeYgAzlAThCSkSgCCw2MFCFOyUk6MmwB8RbELMgA2BaTAws7py+NrUEMA-FBLAFxQPf0DSlIAdL8LSrInDtOm8IAA3Pq4a6rKYzYhkRbQybTWZkRgYPaoKGjG5TYokIKpKAACSqBKJXSujx6EK6SmKpIO6T2rwWIJgAEM4JCkbc4XMlLgkrypvE4D44AEAO5wTbbJxKQTEMAnRhBDlHCYQTGUKB4EVQfFwQkEEkGjxsYBk40U9K6vVQR6c7l0qA-X5CxJKX7fd59JVEFXQHEwqCEeLQR5hIgSKTEravYk7BWhZWqkPI8ORqDqzXQV5Znb2vWvbErZEYR2G2Ke46nc6XSIG4r8sg8WRNx5ZqCvXNans5jVaqiUBAQMRHDkEaBBMViYBEAKFJhTsQBMc8jN81GkHYACjXY9LBuyuXyhSdXL6NMhOz2W6m3ceUNecHBRNf74IAEpXmCAkQCAjiuBCHhAe5oDYsiyOoyhmHoyiIdoyjWN+VAgWBEHaPYZiyMoMFQeoejGI4aFQAA9ORUAAJK4AAQgMAC0CGUJRUAAALABMjGjJA848QQBABKaUpCWiYjCOOPhQAgnjAJQGHruBkHQbB8GIcoyFGGhrFUZx3G8eOwACUJpqGDJckTApq5KRBUEwXBCFIaoOlAA
[hex-color]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbgChRIoBhFKAZ0JNOygG8BfKm6ABIQAHozQAGTAB90ARmnoATArQBmFQBYVAVhUA2FQHYVADhUBOFQEMVAIxUBjFQhUQVAMxUBBFQCEVdCoAIiowKgBiaHzg0LgAFla0qAD0yVAAxFDAcRBwUKoANFAaRXpQAPYEUCZQDgkEVg7AEARMlFBQMgAG6QAknHTc-YPDQ5zwCNxd7Z1QPaMLA2Mj44hTM919S4sru8tjE+sdmzv7p+fbq5Nd0bReADb3QsIAPLhQIs2ITMysZAB8jHen1yCB+XX6zzGJHcLSgACUplAAPxQB5PEQveGAgBceA+wi+YPQmFRhAArtA8e4rPcmBAqJQEBAHPcrARoO5yXAmkRynkHOV7pU3gSiT8WMQAQAKGYOPHAwmgn7xRLQVGK8VzLYwuG+JGo9HPF6+QEg75ZAiUlH4vFwCAANzhdsdzqg9qdBAKlAAlHiHeUiAhGYLhQRpWh0u5o2gfVRQ5UI+lZFZFL5VE445QE+HIynFLYMyZJFnUlAAALAJgAWhEkCatYIBEqUHYRCYcAA5MAoDlhNmhYnI6QR7GqGXKzW6yzgI3m1VtFAEERSEQqwOw0nZIpVBpdKW0pPa8J67OWvOoABbdtMNgZDdD-OFzNUIA
[uuid]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbgChRIoBhFKAZ0JNOygG8BfKm6ABIQAHozQAGTAB90ARmnoATArQBmFQBYVAVhUA2FQHYVADhUBOFQEMVAIxUBjFQhUQVAMxUBBFQCEVdCoAIiowKgBiaHzg0ABSAPYkADxeUCLAEIhM9ADaALoAfIyp6ZkI2Tkk7hAEUAJpwhlZ9AA0UAB0nVU1UABKDU3luXl5UAD8UAAGACScAtyzCcm9BdyTUABc6FHUMVAA4gTxAK5gSQByA2XZcMcAtrY1bSWN18OM+UWoXjloADaZUjAAAWaFGpWalwmM04SzgKVWs3gCDWmwOR1OFzaOU67S8bTohWitFwwKstFQMMOJzOJlWAFpZtTMRoGUyMWdWdxGZxmZy2byOUlZIpVpNyFAAPSSqAmekaeWKkVQBxkghWBwZAhMXa0IJEUhEYBMJK4K7NFjEMhfPDmoYw7q1Lzc2aOqC+F2cN10T1uoK+uDVWowVHQ2bO2Ye2Y+2b+pGorZoek7fhQLx-P5CYSmu3ZS1sG1miH22ZZhZewM9XqhtMZrNJFZoouvZoYcZQQjHaBbdxWP5MCBUSgICAOP5WAjQdzHOCaojxOBQY7HIgIHPFvOsa0AClXW2bg2ypPJ0Am6czIiS+sNxtNBSKG47BC77bNWzgEAAbj131+agBKLZP0SBAh2XVdtzQEVVAgDRtD0Qx6QgExzFsekRQQVR6SsOC9HlRQ9D0WQNFkQwNHECi0H-KhwIQSDoJgXDEJgFDfHQxQgiwrxcPwwjiNI8jKOoyhpSgAABY0kOESBNSQggjlqAAvKAiCYOAAHJgCgYEREoWj6MUGCmKQlC0IwrCcPg3iiJIsiKMUqiqFEiSmCkmTgDkhSoHHFgoFIDkO3ieJmGBeICGAPSVzoqDDNg+DEOQ1D2Mw7CeI0AibIEoSnJlFy3NHDyai8hArCYHTshIDsdKgAB3I4yCgMBxwcCBIogmKjPiiB6VM5KLLSjL+Ls7KRNyySRHczywoGdUoBKsqVLgJhV2gKw-I5NrouguKEJMpLzNSqz6UG2zBMkYSgA
[printf]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAypDGUC8UDeUDOAuTwBOAlgHYDmA3FACY5ECuAtgEYR5QC+FA9J1AO4AWAQ2BQIg+PygBSALQYEBAGYEWUYIIDWEDAChQkKAEE8JDAB4AYqIAewCEUoZchUgD5kOqFCsRb9x1AABgAkqBj4xCRsUqHEiqoA0myxRPGsAEpsgVAA-FAJNnYOTlogAPaKsAi5UADacBDwtQkAugA0UAB03camZumuLVA4veYDw3UtZDo6lI0ANoJ40Iq0RPDABGVEUIplePTCloX+TuEuJK4AFIr0wDgWHd2dS6YjJuYWrgCUOOeR0x0ewOwiuACIpE4CE4pJQoCAxHgnGV5pQwR0wQARQREdFQADMAEZvtNgYdgODCQAGKlSKSYWjLMEknTcKAAAWAGBkvgQwB5eDw+2kcKIEAgAUEUDoTBYQP25PBkKg0JF8MRyNReKxOO1ROZ0zZnO5vMa-JYQtY9GhGEiUBx9pMDHswHlIIpEKhMLhCKWmrRGOxuJZRq5POsfIFlqg22gr2dRBEwDKZSghyIIDdis92qDeKJLKAA
[xor-props]: https://www.typescriptlang.org/play?#code/PTAEFEEsBcAsFMBOoCCoD2yBCAuU8BDAY1lAGdIATeUAM0wCMqzQ4b03kLqByFga3gBPMgDoAUNCEAHGgA1MAHhQAaUFgB8oALygAFGgBkoAN6gA2gGlQkAHahBQ9LXUBdAPx5b8AG5JQAL4AlKAAPvpYoMZmVjb2js6oHl6+-sEA3OKSMjRYAK7Q0Oi2AAqI6NIsumYANgQM8DV4ZNCIdgDmgVGgCoiKZrCI8LTNrR2BambFAMI1kET8eHoh2lo+6FSBGpniRMUtoHO2i+oFRaXllTqmh-WNeABEACLoRGQPaoPDj8CUr++BTJ7WwHBhnYp4fKFYplCpVG51BpNUAPADKBD8Hwwtlm8xOyx0WhMAUB4hAoAAAtAyABaeAAD1kRGgdMQ5WQDA4pC+LgItko2NxC12+2goE5cEh4IucOutTuyIeAAk8rAsTyfn83liZnMFksVkSSQFMuSqbSGUyWUh2aBvDAEMgeXbMIK9fwRSCxfbOFLoTKrtVbkjHiq1aSgA
