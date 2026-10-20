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
