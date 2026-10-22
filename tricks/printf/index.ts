type Spec = { s: string; d: number }; // what each %-specifier takes
type Args<F extends string> =
  F extends `${string}%${infer K}${infer R}` ? K extends keyof Spec ? [Spec[K], ...Args<R>] : Args<R> : [];

declare function format<F extends string>(fmt: F, ...args: Args<F>): string;

format("%s is %d years old", "Dan", 31);
format("100%% sure");
// @ts-expect-error %d needs a number
format("%s is %d years old", "Dan", "31");
// @ts-expect-error missing an argument
format("%s is %d years old", "Dan");
// @ts-expect-error one argument too many
format("%s", "Dan", 31);
