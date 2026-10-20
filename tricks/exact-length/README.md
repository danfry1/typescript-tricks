# exact-length

String types with an exact length, such as a 3-character country code or a 4-digit PIN.

```ts
type End = "" & String; // a placeholder that only matches ""
type C = string & {};   // a placeholder that matches one character
type D = bigint & {};   // a placeholder that matches one digit

type Country = `${C}${C}${C}${End}`;    // exactly 3 characters
type Pin = `${D}${D}${D}${D}${End}`;    // exactly 4 digits

const gbr: Country = "GBR";
// @ts-expect-error too short
const uk: Country = "UK";
const pin: Pin = "0427";
// @ts-expect-error too short
const short: Pin = "042";
// @ts-expect-error not a digit
const letter: Pin = "04a7";
```

[Open in TS Playground][playground]

## How it works

- `C` (`string & {}`) is a placeholder that, when it isn't the last one in a template literal, matches exactly one character.
- `D` (`bigint & {}`) works the same way, but the character has to be a digit.
- `End` (`"" & String`) goes at the end and takes whatever is left, which has to be `""`. Without it, the final placeholder would soak up any extra characters, so you'd only get a minimum length.

The length is the number of placeholders before `End`.

## Limits

- Emoji (and other characters outside the Basic Multilingual Plane) count as 1 character on TypeScript 7 but 2 on TypeScript 5.9, which counts UTF-16 code units.
- Values typed as plain `string` are rejected, because their length isn't known at compile time.
- For a range of lengths rather than an exact one, see [min-max-length](../min-max-length).

## Credits

First posted [on X](https://x.com/danfrydev/status/2104307925116194988). It builds on [@techsavvytravvy](https://x.com/techsavvytravvy)'s [non-empty string trick](https://x.com/techsavvytravvy/status/2080760184419316130): that gives you a minimum length, and the `"" & String` end marker gives you an exact one.

[playground]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbigHoqoBDKMAGzoGMIALAeyYQgKjAOdYFC5wmIKAFsRrDhADO6NAChQkKAGEUURYRKlsUAN4BfSlGq0GzNpx58BQkTLkLl46PLoE2wfnVwaAARXQAjIlISURxzS2t6RhZ2bl5+QWFRWWB5JTE4aAQoomBVIM0tLgBXOEIpVAADABITLTNW9s6Ok3gEM0aExIgAD39JKABmKB8-VgCCRQroAAUSXRaTEJ7t1t2tnr6BoZooUfGpABYoYujgJdVWcX0oUnCCAC5tGrqCBvQAOIAIQASmhyKpTgABe4AWlGkHm8IIBC4zi4XD03AIZSecBe1QA1l8qrV6ro0ABVADS4Mez1EYBIXzWcApAAZLgAmADsdOhcIRECR-FR6MximxuIZWLRwBZ61QaE5XP5tBhinhI0RwGRYqgcC4ogYt1K9PxoiYEGACwVbKVnLofIhQA
