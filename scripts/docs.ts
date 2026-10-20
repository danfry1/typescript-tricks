// Keeps the READMEs in sync with each trick's index.ts:
// - each trick README embeds its index.ts in a ```ts block,
// - every playground link decodes back to index.ts and has a blank line before it,
// - every line of the teasers in the root README appears in that trick's index.ts.
// `node scripts/docs.ts` rewrites what it can; `--check` only reports drift.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import lz from "lz-string";

const PLAY = "https://www.typescriptlang.org/play?#code/";
type PlaygroundUrl = `${typeof PLAY}${string}`;
type LinkDefinition<Label extends string = string> = `[${Label}]: ${PlaygroundUrl}`;
type TrickFile<Name extends string = string> = `tricks/${Name}/${"index.ts" | "README.md"}`;
type DocFile = "README.md" | TrickFile;

// Every problem the check can report, keyed by kind. Issue<K> turns this into a
// discriminated union, and `messages` has to describe every kind using that kind's fields.
interface Issues {
  "missing-code": { file: TrickFile };
  "stale-code": { file: TrickFile };
  "missing-link": { file: DocFile; label: string; name: string };
  "stale-link": { file: DocFile; label: string; name: string };
  "glued-link": { file: DocFile; label: string };
  "missing-section": { name: string };
  "stray-line": { name: string; line: string };
}
type Kind = keyof Issues;
type Issue<K extends Kind = Kind> = { [P in K]: { kind: P } & Issues[P] }[K];

const messages: { [K in Kind]: (issue: Issue<K>) => string } = {
  "missing-code": ({ file }) => `${file}: missing \`\`\`ts block`,
  "stale-code": ({ file }) => `${file}: code block doesn't match index.ts`,
  "missing-link": ({ file, label, name }) => `${file}: [${label}] link is missing for tricks/${name}/index.ts`,
  "stale-link": ({ file, label, name }) => `${file}: [${label}] link doesn't match tricks/${name}/index.ts`,
  "glued-link": ({ file, label }) => `${file}: [${label}] link needs a blank line before it`,
  "missing-section": ({ name }) => `README.md: missing ### [${name}] section`,
  "stray-line": ({ name, line }) => `README.md: ${name} teaser line isn't in index.ts: ${line}`,
};
const describe = <K extends Kind>(issue: Issue<K>): string => messages[issue.kind](issue);

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const check = process.argv.includes("--check");
const issues: Issue[] = [];
const trickFile = <const Name extends string, const File extends "index.ts" | "README.md">(
  name: Name,
  file: File,
): `tricks/${Name}/${File}` => `tricks/${name}/${file}`;

const tricks = readdirSync("tricks", { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
const code = new Map(tricks.map((name) => [name, readFileSync(trickFile(name, "index.ts"), "utf8")] as const));
const codeOf = (name: string): string => code.get(name) ?? "";

const isPlaygroundUrl = (url: string): url is PlaygroundUrl => url.startsWith(PLAY);
const decodes = (definition: string, name: string): boolean => {
  const url = definition.slice(definition.indexOf(": ") + 2);
  return isPlaygroundUrl(url) && lz.decompressFromEncodedURIComponent(url.slice(PLAY.length)) === codeOf(name);
};
const linkDefinition = <const Label extends string>(label: Label, name: string): LinkDefinition<Label> =>
  `[${label}]: ${PLAY}${lz.compressToEncodedURIComponent(codeOf(name))}`;

// Checks or rewrites the link definition `[label]: <url>` so it points at `name`'s code.
function syncLink(text: string, file: DocFile, label: string, name: string): string {
  // A definition can't interrupt a paragraph, so one right under text renders as plain text.
  const glued = new RegExp(`^((?!\\[[^\\]]+\\]: ).+)\\n(\\[${label}\\]: )`, "m");
  if (glued.test(text)) {
    if (check) issues.push({ kind: "glued-link", file, label });
    else text = text.replace(glued, (_, before: string, def: string) => `${before}\n\n${def}`);
  }
  const re = new RegExp(`^\\[${label}\\]: .*$`, "m");
  const line = text.match(re)?.[0];
  if (line && decodes(line, name)) return text;
  if (check) {
    issues.push({ kind: line ? "stale-link" : "missing-link", file, label, name });
    return text;
  }
  const fresh = linkDefinition(label, name);
  assert(decodes(fresh, name), `round trip failed for ${name}`);
  if (line) return text.replace(re, () => fresh);
  const afterDefinition = /^\[[^\]]+\]: /.test(text.trimEnd().split("\n").pop() ?? "");
  return text.trimEnd() + (afterDefinition ? "\n" : "\n\n") + fresh + "\n";
}

function save(file: DocFile, before: string, after: string): void {
  if (before === after || check) return;
  writeFileSync(file, after);
  console.log(`updated ${file}`);
}

for (const name of tricks) {
  const file = trickFile(name, "README.md");
  const before = readFileSync(file, "utf8");
  let text = before;
  const block = text.match(/```ts\n([\s\S]*?)```/);
  if (!block) issues.push({ kind: "missing-code", file });
  else if (block[1] !== codeOf(name)) {
    if (check) issues.push({ kind: "stale-code", file });
    else text = text.replace(block[0], () => "```ts\n" + codeOf(name) + "```");
  }
  text = syncLink(text, file, "playground", name);
  save(file, before, text);
}

const before = readFileSync("README.md", "utf8");
let root = before;
const sections = new Map(
  root.split(/^### /m).slice(1).map((s) => [s.match(/^\[([a-z0-9-]+)\]/)?.[1] ?? "", s] as const),
);
for (const name of tricks) {
  root = syncLink(root, "README.md", name, name);
  const section = sections.get(name);
  if (!section) {
    issues.push({ kind: "missing-section", name });
    continue;
  }
  const lines = new Set(codeOf(name).split("\n"));
  for (const [, body = ""] of section.matchAll(/```ts\n([\s\S]*?)```/g)) {
    for (const line of body.split("\n").filter(Boolean)) {
      if (!lines.has(line)) issues.push({ kind: "stray-line", name, line });
    }
  }
}
save("README.md", before, root);

for (const issue of issues) console.error(describe(issue));
if (issues.length) {
  console.error(check ? "\nRun `pnpm docs:sync` to fix generated parts." : "");
  process.exit(1);
}
console.log(check ? "docs in sync" : "docs up to date");
