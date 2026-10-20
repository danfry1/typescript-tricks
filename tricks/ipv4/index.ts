type End = "" & String;
type D = bigint & {};
type N = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Octet =
  | `${D}${End}`                                // 0-9
  | `${N}${D}${End}`                            // 10-99
  | `1${D}${D}${End}`                           // 100-199
  | `2${"0" | "1" | "2" | "3" | "4"}${D}${End}` // 200-249
  | `25${"0" | "1" | "2" | "3" | "4" | "5"}`;   // 250-255

declare function ip<S extends string>(
  address: S extends `${infer W}.${infer X}.${infer Y}.${infer Z}`
    ? [W, X, Y, Z] extends [Octet, Octet, Octet, Octet] ? S : never
    : never,
): void;

ip("192.168.0.1");
ip("255.255.255.255");
// @ts-expect-error 256 is out of range
ip("256.0.0.1");
// @ts-expect-error leading zero
ip("01.2.3.4");
// @ts-expect-error too few parts
ip("1.2.3");
// @ts-expect-error too many parts
ip("1.2.3.4.5");
