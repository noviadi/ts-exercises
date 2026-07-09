/**
 * PROMPT — Disabling distribution with the `[T] extends [...]` trick
 *
 * Sometimes distribution is the WRONG behaviour. The classic case is a
 * "non-distributing Exclude": given `T` and `U`, drop from `T` only when the
 * WHOLE `T` (as a unit) is assignable to `U`, rather than testing each member.
 *
 * The standard fix: wrap `T` (and `U`) in a one-element tuple. `[T]` is no
 * longer a *naked* type parameter, so the conditional does not distribute.
 *
 *   [T] extends [U] ? X : Y     ← runs ONCE, on the whole union
 *
 * Your job:
 *   - Implement `ToArrayNonDist<T>` — the non-distributing version of ToArray,
 *     so `ToArrayNonDist<"a" | "b">` is `("a" | "b")[]` (NOT `"a"[] | "b"[]`).
 *   - Implement `ExcludeWhole<T, U>` — drops `T` only if the ENTIRE `T` is
 *     assignable to `U` (contrast with the distributing `Exclude`).
 *
 * Run:  npx tsc --noEmit 02-disable-distribution.problem.ts
 */

// TODO: non-distributing ToArray — wrap T in a tuple on BOTH sides.
type ToArrayNonDist<T> = TODO;

// TODO: non-distributing Exclude — drop T only when the WHOLE T extends U.
type ExcludeWhole<T, U> = TODO;

// ---------------------------------------------------------------------------
// Fix the types above; the CHECKS below must compile once you do.
// ---------------------------------------------------------------------------

import { expectTypeOf } from "@lib";

// CHECKS — these fail until both types are correct.
expectTypeOf<ToArrayNonDist<"a" | "b">>().toEqualTypeOf<("a" | "b")[]>();
expectTypeOf<ToArrayNonDist<"a" | "b">>().not.toEqualTypeOf<"a"[] | "b"[]>();

// The whole union "a" | "b" is NOT assignable to "a" alone, so it is kept:
expectTypeOf<ExcludeWhole<"a" | "b", "a">>().toEqualTypeOf<"a" | "b">();
// But the whole union IS assignable to `string`, so it is dropped:
expectTypeOf<ExcludeWhole<"a" | "b", string>>().toEqualTypeOf<never>();
