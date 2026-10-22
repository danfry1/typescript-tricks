type End = "" & String;
type C = string & {};
type Hex = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a" | "b" | "c" | "d" | "e" | "f" | "A" | "B" | "C" | "D" | "E" | "F";
type Shape = // # then 3, 4, 6 or 8 characters
  | `#${C}${C}${C}${End}`
  | `#${C}${C}${C}${C}${End}`
  | `#${C}${C}${C}${C}${C}${C}${End}`
  | `#${C}${C}${C}${C}${C}${C}${C}${C}${End}`;
type AllHex<S extends string> = S extends `${Hex}${infer R}` ? AllHex<R> : S extends "" ? true : false;

declare function color<S extends string>(
  c: S extends Shape ? S extends `#${infer B}` ? AllHex<B> extends true ? S : never : never : never,
): void;

color("#fff");
color("#1a2B3c");
color("#1a2b3c80");
// @ts-expect-error g isn't hex
color("#ggg");
// @ts-expect-error 5 digits
color("#12345");
// @ts-expect-error missing #
color("1a2b3c");
