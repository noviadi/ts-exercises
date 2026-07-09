/**
 * PROMPT — Overloads vs conditional types vs union returns
 *
 * We want a `first<T>(xs: T[] | T): T` helper that, given an array, returns a
 * single `T`, and given a single value, returns it unchanged. We'll author the
 * SAME behaviour three ways and capture the differences in the type system.
 *
 * Your job:
 *   1. Fill in the three TODOs (overload list, conditional return, union return).
 *   2. Fix each CHECK region so it reflects what THAT style actually gives you
 *      at the call site. Some assertions are intentionally wrong — annotate
 *      real errors with `// @ts-expect-error`.
 *
 * Rules of the game:
 *   - No `any`.
 *   - Keep the three implementations independent; each should typecheck on its own.
 *
 * Run:  npx tsc --noEmit 02-overloads-vs-conditionals-vs-unions.problem.ts
 */

// --- Style A: overloads ----------------------------------------------------
// TODO: declare overload signatures for `firstOverload`.

function firstOverload<T>(xs: T[] | T): T {
  return Array.isArray(xs) ? xs[0] as T : xs;
}

// --- Style B: conditional types -------------------------------------------
// TODO: write `firstConditional` whose return type is a conditional that maps
// `T[] => T` and otherwise `T`. Use a single generic parameter `<T>`.

// --- Style C: plain union return ------------------------------------------
// TODO: write `firstUnion` returning `T` for both — but where the caller sees
// the SAME type regardless of input shape.

import { expectTypeOf } from "@lib";

// CHECKS — describe each style.
// (fill these in to reflect reality)

expectTypeOf(firstOverload([1, 2, 3])).toEqualTypeOf<number>(); // ❓
expectTypeOf(firstOverload(7)).toEqualTypeOf<number>(); // ❓

// firstConditional([1,2,3])   → number
// firstConditional(7)         → number

// firstUnion([1,2,3])         → number
// firstUnion(7)               → number
