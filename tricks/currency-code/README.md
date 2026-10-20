# currency-code

A string type for 3-letter uppercase codes like `"GBP"` and `"USD"`.

```ts
type End = "" & String;
type C = string & {};

type CurrencyCode = Uppercase<string> & `${C}${C}${C}${End}`; // 3 uppercase characters

const gbp: CurrencyCode = "GBP";
const usd: CurrencyCode = "USD";
// @ts-expect-error lowercase
const lower: CurrencyCode = "gbp";
// @ts-expect-error too long
const long: CurrencyCode = "GBPX";
```

[Open in TS Playground][playground]

## How it works

- `Uppercase<string>` is a valid type on its own: it only accepts strings that are already uppercase, so `"GBP"` passes and `"gbp"` or `"GbP"` don't.
- Intersecting it with the [exact-length](../exact-length) pattern `` `${C}${C}${C}${End}` `` adds "exactly 3 characters".

## Limits

- Digits and symbols have no case, so they count as uppercase: `"G1P"` is accepted. For letters only, use a union of the 26 letters per position (`` `${L}${L}${L}` ``, 17,576 combinations, which TypeScript handles fine). That loses the `Uppercase` trick and can't scale to longer strings.
- It checks the format, not whether the currency exists in ISO 4217.

[playground]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbgChRIoBhFKAZ0JNOygG8BfK68aHQCuBAhDgBjEHQD2CaKgCqYSAQkBDJhAA8LYmQB8HAAYASTnW7nL1q53gJux8lAD0rqAGYoQlRDWa0BIAFuoE6hLA-kyUlBIycCxQpABGYABc9CJiktJyCugA4gBCAApoVPGJwD5MCJnCouJSsvKMaIq4ACIVlO5QAALATAC0EAAekJFjojIEUAA2MgDu-hpacQlJS6sEDdnNeW2oaKlgvf1DoxNTwDMEc1DAMjKLCaSb1W9k+025rQU0CVSgANXpAA
