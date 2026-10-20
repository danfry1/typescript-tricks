type End = "" & String;
type D = bigint & {};
type N = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Port =
  | `${N}${End}` | `${N}${D}${End}` | `${N}${D}${D}${End}` | `${N}${D}${D}${D}${End}`
  | `${"1" | "2" | "3" | "4" | "5"}${D}${D}${D}${D}${End}`
  | `6${"0" | "1" | "2" | "3" | "4"}${D}${D}${D}${End}`
  | `65${"0" | "1" | "2" | "3" | "4"}${D}${D}${End}`
  | `655${"0" | "1" | "2"}${D}${End}`
  | `6553${"0" | "1" | "2" | "3" | "4" | "5"}`;

declare function listen<P extends number>(port: `${P}` extends Port ? P : never): void;

listen(3000);
listen(65535);
// @ts-expect-error
listen(65536);
// @ts-expect-error
listen(0);
