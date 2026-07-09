/**
 * PROMPT — `unique symbol` vs plain `symbol`
 *
 * TypeScript treats a plain `symbol` as one big interchangeable type. But a
 * `unique symbol` is pinned to a single identity, which is what makes
 * symbol-keyed brands possible.
 *
 * Your job:
 *   1. Replace each `TODO` so the file typechecks and the CHECKS describe the
 *      TRUE relationships. Use `toExtend` (assignable), `toEqualTypeOf`
 *      (identical), or `.not.` where the answer is "no".
 *   2. Add `// @ts-expect-error <reason>` above any line that should genuinely
 *      error once uncommented.
 *
 * Rules:
 *   - Do NOT change the `declare const` lines' kinds (they're the point).
 *   - Use a `unique symbol` to type a symbol-keyed property where marked.
 *
 * Run:  npx tsc --noEmit 01-unique-basics.problem.ts
 */

// A plain `symbol` — wide type, identity not tracked.
declare const plainA: symbol;
declare const plainB: symbol;

// TODO: declare two DISTINCT unique symbols `uidA` and `uidB`.
// declare const uidA: /* TODO */;
// declare const uidB: /* TODO */;

import { expectTypeOf } from "@lib";

// CHECKS — fix the assertions to describe reality.

// A unique symbol IS assignable to the wide `symbol` type:
// expectTypeOf<typeof uidA>().toExtend<symbol>();

// Two different unique symbols are NOT identical types:
// expectTypeOf<typeof uidA>().not.toEqualTypeOf<typeof uidB>();

// But two plain `symbol` variables ARE the same type (identity lost):
// expectTypeOf<typeof plainA>().toEqualTypeOf<typeof plainB>();

// A unique symbol can be a computed property key INSIDE A TYPE — declare one
// and define `Tagged` keyed by it:
// declare const brand: /* TODO: a unique symbol */;
// type Tagged = { readonly [brand]: "tag" };
