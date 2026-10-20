type N = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Part = "0" | (`${bigint}` & `${N}${string}`);
type SemVer = `${Part}.${Part}.${Part}` | `${Part}.${Part}.${Part}-${string & {}}${string}`;

const a: SemVer = "1.2.3";
const b: SemVer = "10.0.0-beta.1";
// @ts-expect-error leading zero
const c: SemVer = "1.02.3";
// @ts-expect-error
const d: SemVer = "1.2.3.4";
// @ts-expect-error
const e: SemVer = "1.2.x";
