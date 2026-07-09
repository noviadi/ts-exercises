/**
 * PROMPT — Excess property checks (the one structural-typing exception)
 *
 * Normally, "more properties = still assignable" (Topic 01). But TS has ONE
 * special, stricter rule for **fresh object literals** assigned directly: it
 * will *reject* properties it doesn't know about. This prevents typos like
 * `{ naem: "x" }`.
 *
 * Your job:
 *   1. Look at each line marked with a question. Predict: compile or error?
 *   2. Uncomment the lines and fix them so the file typechecks, keeping a
 *      `// @ts-expect-error` ONLY where TS genuinely errors.
 *
 * Run:  npx tsc --noEmit 02-excess-property-checks.problem.ts
 */

type Point = { x: number; y: number };

function draw(p: Point): void {}

// TODO: predict, then uncomment & annotate each.

// draw({ x: 1, y: 2, z: 3 });               // ❓ excess property `z`?
// const p = { x: 1, y: 2, z: 3 }; draw(p);  // ❓ same object, via a variable?

// `export {}` makes this file a module so its `Point`/`draw` don't leak into
// the shared global scope when the whole repo is type-checked together.
export {};

