/**
 * PROMPT — `satisfies` vs annotation vs `as`
 *
 * Three ways to relate a value to a type:
 *
 *   const x: T  = expr      // annotation: RE-TYPES `x` as T (widens literals)
 *   const x     = expr as T // assertion:   TRUSTS you (no checking; can lie)
 *   const x     = expr satisfies T // checks expr fits T, KEEPS narrow type
 *
 * `satisfies` shines when the constraint is a *union of literals* (e.g.
 * `"open" | "closed"`): the check still runs, but each property keeps its
 * narrow literal so later code can branch exhaustively.
 *
 * ⚠️ Subtlety: when the constraint is the wide `string`, the literal is widened
 * just like a plain annotation. `satisfies` preserves literals that are *part
 * of a finite literal union in the constraint*.
 *
 * Your job:
 *   1. Apply `satisfies` (NOT an annotation) to `good` so each property's
 *      literal survives.
 *   2. Predict, from the contrast CHECK, what `annotated.draft` widens to.
 *
 * Run:  npx tsc --noEmit 01-satisfies-vs-annotation.problem.ts
 */

type Status = "open" | "closed" | "archived";
type StatusMap = Record<"draft" | "published", Status>;

// TODO: validate against `StatusMap` while preserving the literal type of each.
const good = { draft: "open", published: "closed" }; // ❓ apply `satisfies`

import { expectTypeOf } from "@lib";

// CHECKS — `good.draft` must be the literal "open", not the wide `Status`.
expectTypeOf<typeof good.draft>().toEqualTypeOf<"open">();
expectTypeOf<typeof good>().toExtend<StatusMap>();
