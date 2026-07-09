#!/usr/bin/env node
// Scope the type-checker to ONE file or ONE exercise folder, while still
// honouring the root tsconfig (the `@lib` path alias + all strict flags).
//
// Usage:
//   npm run check -- topics/01-structural-typing
//   npm run check -- topics/01-structural-typing/01-assignability.problem.ts
//
// We can't just do `tsc --noEmit <file>` because passing files on the CLI makes
// tsc ignore tsconfig.json entirely (so `@lib` won't resolve and the strict
// flags vanish). Instead we generate a throwaway tsconfig that `extends` the
// root and narrows `include` to the target (+ `src/` so `@lib` resolves).

import { writeFileSync, statSync, rmSync } from "node:fs";
import { resolve, relative, isAbsolute, join } from "node:path";
import { spawnSync } from "node:child_process";

const arg = process.argv[2];
const root = process.cwd();

if (!arg) {
  console.error("Usage: npm run check -- <topic-folder | file>");
  console.error("  npm run check -- topics/01-structural-typing");
  console.error("  npm run check -- topics/01-structural-typing/01-assignability.problem.ts");
  process.exit(2);
}

const targetAbs = isAbsolute(arg) ? arg : resolve(root, arg);
let st;
try {
  st = statSync(targetAbs);
} catch {
  console.error(`✗ Not found: ${targetAbs}`);
  process.exit(2);
}

const rel = relative(root, targetAbs);
const includeTarget = st.isDirectory() ? `${rel}/**/*.ts` : rel;
const tmpPath = join(root, ".tsconfig.check.json");

const config = {
  extends: "./tsconfig.json",
  include: ["src/**/*.ts", includeTarget],
  exclude: ["node_modules", "dist"],
};
writeFileSync(tmpPath, JSON.stringify(config, null, 2));

const result = spawnSync("node_modules/.bin/tsc", ["-p", tmpPath, "--noEmit"], {
  stdio: "inherit",
  cwd: root,
});

rmSync(tmpPath, { force: true });
process.exit(result.status ?? 1);
