# iso-date

A `YYYY-MM-DD` string type that knows how many days each month has, including leap years.

```ts
type End = "" & String;
type D = bigint & {};
type N = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Day = `0${N}` | `1${D}` | `2${Exclude<N, "9"> | "0"}`;
type Y = `${D}${D}${D}${D}${End}`;
type Q = "00" | "04" | "08" | "12" | "16" | "20" | "24" | "28" | "32" | "36" | "40" | "44" | "48"
  | "52" | "56" | "60" | "64" | "68" | "72" | "76" | "80" | "84" | "88" | "92" | "96";

type IsoDate =
  | `${Y}-${"01" | "03" | "05" | "07" | "08" | "10" | "12"}-${Day | "29" | "30" | "31"}${End}`
  | `${Y}-${"04" | "06" | "09" | "11"}-${Day | "29" | "30"}${End}`
  | `${Y}-02-${Day}${End}`
  | `${D}${D}${Exclude<Q, "00">}-02-29` | `${Q}00-02-29`;

const ok: IsoDate[] = ["2026-10-20", "2028-02-29", "2000-02-29"];
// @ts-expect-error
const a: IsoDate = "2026-02-29";
// @ts-expect-error
const b: IsoDate = "1900-02-29";
// @ts-expect-error
const c: IsoDate = "2026-04-31";
```

[Open in TS Playground][playground]

## How it works

- `D` (`bigint & {}`) matches one digit, and `Y` is four of them.
- `Day` covers days `01` to `28`, which are valid in every month. Months with 31 days add `29`–`31`, months with 30 days add `29`–`30`, and February gets only `Day`.
- February 29 has its own two branches, based on the Gregorian leap-year rules:
  - `` `${D}${D}${Exclude<Q, "00">}-02-29` ``: years whose last two digits are a non-zero multiple of 4 (2024, 2028, …).
  - `` `${Q}00-02-29` ``: century years where the century is a multiple of 4 (2000, 2400, …), and not 1900 or 2100.
- `Q` lists every two-digit multiple of 4. Writing the list out by hand keeps it flat, with no recursion.

## Limits

- Only dates. Times, time zones and the `YYYYMMDD` basic format are rejected.
- Years are limited to four digits (`0000`–`9999`).

## Prior art

[leptonite/type-system-parsers](https://github.com/leptonite/type-system-parsers) validates dates with a generic, recursive parser. This version is a flat union of template literals instead.

[playground]: https://www.typescriptlang.org/play?#code/C4TwDgpgBAogdgEygXigIjVAZFAysAJwEs4BzAbgChRIoARFKAIyNJOGygG8BfKm6ADlGaAIyYAPugBMk9AGY5aACxKArEoBsSgOxKAHEoCcafuGh0AhiEYADAAwASLoJ62oU26Od03HqLbSzjAAHgDGADYArggQADyCADToJgB8-mj2aG5mtACadj48RSVcvsGIOdTmUACKIvZZGfaqzYYZorId2hnSTVJo0q0D0u0D8l3jPQPK-ejKw-OGlFAZapPoatPomnNomov7Y+g6G2g622j6e-qH+sdoRmdG2lTVtACSAM4A9lbA0GQK38tmceR4AFpnJlxM1FM0NM09G0lKI9p1slCytZeiYMvI9vJxMUuPAEG5gZ4wZDoS0lPZLvY8QNRMSsVYbCNmQosiSyRTVlSuOCIfZpOzrHzKrZKQFSuVSeForE4rVkpksqlIWKIdIjO4hbUeI1ReK9bY3mEfnAvhwfgBrABcUG+f0sAIA2gBdRgewZizQQtG6rLqvqjU26kxhxr2SN6tBeqgAemTUAAAsAvhCICFIGFgDmCAQfgRKFabRxLM7Xf9ATIA-GTCm05ns7n84WIMXS+XrbbmDXfnWRKIjCadQmWxmszm8xAC0WS2WKwOwkO3QCROHAy0IUTTJQgA
