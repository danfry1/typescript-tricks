type End = "" & String;
type C = string & {};
type Hex = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "a" | "b" | "c" | "d" | "e" | "f" | "A" | "B" | "C" | "D" | "E" | "F";
type Join<A extends C[]> = A extends [infer H extends C, ...infer R extends C[]] ? `${H}${Join<R>}` : "";
type Group<N extends number, A extends C[] = []> = A["length"] extends N ? `${Join<A>}${End}` : Group<N, [...A, C]>;
type Shape = `${Group<8>}-${Group<4>}-${Group<4>}-${Group<4>}-${Group<12>}`; // 8-4-4-4-12 characters
type Digits<S extends string> = S extends `${infer A}-${infer B}-${infer C}-${infer D}-${infer E}` ? `${A}${B}${C}${D}${E}` : "-";
type AllHex<S extends string> = S extends `${Hex}${infer R}` ? AllHex<R> : S extends "" ? true : false;

declare function uuid<S extends string>(id: S extends Shape ? AllHex<Digits<S>> extends true ? S : never : never): void;

uuid("123e4567-e89b-12d3-a456-426614174000");
uuid("123E4567-E89B-12D3-A456-426614174000");
// @ts-expect-error z isn't hex
uuid("123e4567-e89b-12d3-a456-42661417400z");
// @ts-expect-error last group too short
uuid("123e4567-e89b-12d3-a456-42661417400");
// @ts-expect-error dashes in the wrong place
uuid("123e4567e-89b-12d3-a456-426614174000");
// @ts-expect-error extra dash inside a group
uuid("123e4567-e89b-12d3-a456--26614174000");
