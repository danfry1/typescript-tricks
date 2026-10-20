type End = "" & String; // a placeholder that only matches ""
type C = string & {};   // a placeholder that matches one character
type D = bigint & {};   // a placeholder that matches one digit

type Country = `${C}${C}${C}${End}`;    // exactly 3 characters
type Pin = `${D}${D}${D}${D}${End}`;    // exactly 4 digits

const gbr: Country = "GBR";
// @ts-expect-error too short
const uk: Country = "UK";
const pin: Pin = "0427";
// @ts-expect-error too short
const short: Pin = "042";
// @ts-expect-error not a digit
const letter: Pin = "04a7";
