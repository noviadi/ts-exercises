/**
 * SOLUTION — Disabling distribution: the `[T] extends [...]` trick
 *
 * Why wrapping in a tuple stops distribution:
 *
 *   Distribution fires ONLY when the left of `extends` is a *naked* type
 *   parameter. `[T]` is a *tuple containing* `T` — a different expression —
 *   so it is no longer "naked T". The conditional is therefore evaluated
 *   exactly ONCE, on the entire (possibly union) type `T`.
 *
 *   [T] extends [U] ? X : Y
 *     │        │
 *     │        └─ U wrapped to match — keeps the assignability check honest
 *     └─ T wrapped → no longer naked → no distribution
 *
 * Wrapping `U` in a tuple too is just to keep the `extends` shape symmetric;
 * `[A] extends [B]` is true iff `A extends B` (tuples are covariant).
 */

// explanation: `[T]` is a 1-tuple, not a naked type parameter, so the
// conditional runs once on the whole union. The result is a single array of
// the union — `("a" | "b")[]` — rather than a union of arrays.
type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never;

// explanation: a non-distributing Exclude. Because `[T]` is not naked, we test
// the ENTIRE union `T` against `U` as a single unit. If the whole thing is
// assignable to `U`, we drop it (`never`); otherwise we keep all of it. This
// is the OPPOSITE of the distributing Exclude, which would test each member.
type ExcludeWhole<T, U> = [T] extends [U] ? never : T;

import { expectTypeOf } from "@lib";

// CHECKS — all pass.

// One array of the union (NOT a union of arrays):
expectTypeOf<ToArrayNonDist<"a" | "b">>().toEqualTypeOf<("a" | "b")[]>();
expectTypeOf<ToArrayNonDist<"a" | "b">>().not.toEqualTypeOf<"a"[] | "b"[]>();

// Contrast with the DISTRIBUTING ToArray from 01-:
//   ToArray<"a" | "b">      === "a"[] | "b"[]     (distributed)
//   ToArrayNonDist<"a" | "b"> === ("a" | "b")[]   (not distributed)

// ExcludeWhole keeps the union because the whole union is NOT assignable to "a":
expectTypeOf<ExcludeWhole<"a" | "b", "a">>().toEqualTypeOf<"a" | "b">();
// But the whole union IS assignable to `string`, so it is dropped entirely:
expectTypeOf<ExcludeWhole<"a" | "b", string>>().toEqualTypeOf<never>();

// 💡 The `[T] extends [U]` idiom is also the canonical fix for two famous
//    gotchas:
//      1. `IsNever<T>` — `T extends never ? true : false` is NEVER true when
//         T is `never`, because a distributing conditional over `never` yields
//         `never` (the empty union). The fix: `[T] extends [never] ? ...`.
//      2. `IsEqual<A, B>` — naive `A extends B ? B extends A ? true : false`
//         mishandles `any`; the tuple-wrapped / function-wrapped form in
//         `src/lib.ts`'s `IsEqual` is the robust version.
//
// 💡 Rule of thumb: if you want per-member behaviour (filtering, mapping),
//    KEEP `T` naked. If you want whole-type behaviour (exact equality,
//    "is the whole thing assignable"), wrap with `[T]`.
