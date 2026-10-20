type End = "" & String;
type D = bigint & {};
type Thrice = ["0", "3", "6", "9", "12", "15", "18", "21", "24", "27"];
type Digit = keyof Thrice & `${number}`;
type Thirteen = `${D}${D}${D}${D}${D}${D}${D}${D}${D}${D}${D}${D}${D}${End}`;
type Rep<N extends string, A extends 0[] = []> = `${A["length"]}` extends N ? A : Rep<N, [...A, 0]>;
type Rev<S extends string, A extends string = ""> = S extends `${infer H}${infer R}` ? Rev<R, `${H}${A}`> : A;
type Ean<S extends string, Sum extends unknown[] = [], Triple = false> =
  S extends `${infer H extends Digit}${infer R}`
    ? Ean<R, [...Sum, ...Rep<Triple extends true ? Thrice[H] : H>], Triple extends true ? false : true>
    : S extends "" ? `${Sum["length"]}` extends `${string}0` ? true : false : false;

declare function barcode<S extends string>(code: S extends Thirteen ? Ean<Rev<S>> extends true ? S : never : never): void;

barcode("4006381333931");
barcode("9780306406157"); // ISBN-13
// @ts-expect-error wrong check digit
barcode("4006381333932");
// @ts-expect-error 12 digits
barcode("400638133393");
