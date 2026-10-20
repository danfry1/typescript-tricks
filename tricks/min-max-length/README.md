# min-max-length

A string type that only accepts values between a minimum and maximum length, e.g. 3 to 8 characters.

```ts
type End = "" & String; // only matches ""
type C = string & {};   // exactly one character
type O = C | "";        // one character, or nothing

type Username = `${C}${C}${C}${O}${O}${O}${O}${O}${End}`; // 3 to 8 characters

const a: Username = "dan";
const b: Username = "danfry";
// @ts-expect-error too short
const c: Username = "dg";
// @ts-expect-error too long
const d: Username = "danfrydev1";
```

[Open in TS Playground][playground]

## How it works

- `C` (`string & {}`) is a placeholder that, when it isn't the last one in a template literal, matches exactly one character.
- `O` (`C | ""`) is an optional character.
- `End` (`"" & String`) goes at the end and takes whatever is left, which has to be `""`. Without it, the final placeholder would soak up any extra characters.

The minimum length is the number of `C`s, and the maximum is that number plus the number of `O`s.

## Limits

- The maximum minus the minimum can be at most 16. Each `O` doubles the size of the union, and 17 of them fails with `TS2590: Expression produces a union type that is too complex to represent`.
- Emoji (and other characters outside the Basic Multilingual Plane) count as 1 character on TypeScript 7 but 2 on TypeScript 5.9, which counts UTF-16 code units.

## Credits

This extends [exact-length](../exact-length) ([first posted on X](https://x.com/danfrydev/status/2104307925116194988)) from an exact length to a range. exact-length itself built on [@techsavvytravvy](https://x.com/techsavvytravvy)'s [non-empty string trick](https://x.com/techsavvytravvy/status/2080760184419316130).

[playground]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbigHoqoB7OAGxCgFsBDYAYwAsIBndGgBQoSFADCKKP0IlS2KAG8AvpSjVaEAB7suwZvTjRe7AnuAQCo8NADy0qQB8h6je81GTPMxasAaegIoODpgHnlhG3EAVX4rOHZWaFQAAwASJQkVTOzcnKU7AqLMksLigvgEFVTKGigAZihgOigADihTc30rfiiuBlkodgAuKDiEpJT0BHY4NHJhAbghgCMxiYJE5Ok0WbgAMwIQBeF6gAFgfgBaHUh9W4ICOmCW1v4eF+AlweBOjfiWymuwQpFOFyut2092Aj2erzorUYDFIPxWfwQAMmO1QezmRxACAgADcAIynIA
