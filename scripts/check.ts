// Type-checks each trick folder in its own tsc run. The tricks are global
// scripts that reuse type names (End, D, N, ...), so one combined run would clash.
// Run via `pnpm check` so the local tsc is on PATH.
import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

const TSC_ARGS = ["--strict", "--noEmit"] as const;
const tricks = readdirSync("tricks", { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

let failed = 0;
for (const name of tricks) {
  const { status } = spawnSync("tsc", [...TSC_ARGS, `tricks/${name}/index.ts`], { stdio: "inherit", shell: true });
  console.log(`${status === 0 ? "ok  " : "FAIL"} ${name}`);
  if (status !== 0) failed++;
}
process.exit(failed ? 1 : 0);
