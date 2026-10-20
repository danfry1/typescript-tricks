type End = "" & String;
type C = string & {};

type CurrencyCode = Uppercase<string> & `${C}${C}${C}${End}`; // 3 uppercase characters

const gbp: CurrencyCode = "GBP";
const usd: CurrencyCode = "USD";
// @ts-expect-error lowercase
const lower: CurrencyCode = "gbp";
// @ts-expect-error too long
const long: CurrencyCode = "GBPX";
