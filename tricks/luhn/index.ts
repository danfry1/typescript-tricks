type Twice = ["0", "2", "4", "6", "8", "1", "3", "5", "7", "9"];
type Digit = keyof Twice & `${number}`;
type Rep<N extends string, A extends 0[] = []> = `${A["length"]}` extends N ? A : Rep<N, [...A, 0]>;
type Rev<S extends string, A extends string = ""> = S extends `${infer H}${infer R}` ? Rev<R, `${H}${A}`> : A extends "" ? "!" : A;
type Luhn<S extends string, Sum extends unknown[] = [], Dbl = false> =
  S extends `${infer H extends Digit}${infer R}`
    ? Luhn<R, [...Sum, ...Rep<Dbl extends true ? Twice[H] : H>], Dbl extends true ? false : true>
    : S extends "" ? `${Sum["length"]}` extends `${string}0` ? true : false : false;

declare function card<S extends string>(n: Luhn<Rev<S>> extends true ? S : never): void;

card("4242424242424242");
// @ts-expect-error one digit off
card("4242424242424241");
