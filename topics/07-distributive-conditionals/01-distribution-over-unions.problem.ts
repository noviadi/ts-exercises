/**
 * PROMPT — Distribution over unions (the NakedTypeParam rule)
 *
 * A conditional type `T extends U ? X : Y` *distributes* over unions when `T`
 * is a **naked type parameter** — i.e. `T` written by itself on the left of
 * `extends`, not wrapped in a tuple/array/etc. Concretely, for a union
 * `A | B | C`:
 *
 *   (A | B | C) extends U ? X : Y
 *     becomes  (A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)
 *
 * Your job:
 *   - Implement `ToArray<T>` so that `ToArray<"a" | "b">` is `"a"[] | "b"[]`
 *     (NOT `("a" | "b")[]`). The implementation is the obvious one — the
 *     interesting part is *why* it distributes.
 *
 * Run:  npx tsc --noEmit 01-distribution-over-unions.problem.ts
 */

// TODO: wrap T in an array. Use `T extends unknown ? T[] : never` and rely on
// distribution to do the right thing for unions.
type ToArray<T> = TODO;

// ---------------------------------------------------------------------------
// Fix the type above; the CHECKS below must compile once you do.
// ---------------------------------------------------------------------------

import { expectTypeOf } from "@lib";

// CHECKS — these fail until ToArray distributes over the input union.
expectTypeOf<ToArray<"a">>().toEqualTypeOf<"a"[]>();
expectTypeOf<ToArray<"a" | "b">>().toEqualTypeOf<"a"[] | "b"[]>();
// The distributed result is NOT the same as wrapping the whole union:
expectTypeOf<ToArray<"a" | "b">>().not.toEqualTypeOf<("a" | "b")[]>();
