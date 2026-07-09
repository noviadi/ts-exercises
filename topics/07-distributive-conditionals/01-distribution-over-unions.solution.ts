/**
 * SOLUTION — Distribution over unions
 *
 * THE NAKED TYPE PARAMETER RULE
 *
 *   A conditional `T extends U ? X : Y` distributes over the union members of
 *   `T` IFF `T` is a *naked* type parameter — that is, `T` is the bare type
 *   variable declared in `<T>` and nothing else. The moment you wrap it
 *   (e.g. `[T]`, `T[]`, `${T}`), it stops being naked and distribution is off.
 *
 * Distribution works like a `.map()` over the union:
 *
 *   ToArray<"a" | "b">
 *     = ("a" extends unknown ? "a"[] : never)      ← "a" mapped
 *     | ("b" extends unknown ? "b"[] : never)      ← "b" mapped
 *     = "a"[] | "b"[]
 *
 * Note this is DIFFERENT from `("a" | "b")[]`, which is an array whose
 * elements can be either. The distributed result is a UNION OF ARRAYS.
 */

// explanation: the textbook distributed conditional. `T` is naked (just `T`,
// not `[T]`), so TS evaluates the conditional once per member of `T`'s union
// and unions the results. `T extends unknown` is always true, so each member
// becomes `Member[]`.
type ToArray<T> = T extends unknown ? T[] : never;

import { expectTypeOf } from "@lib";

// CHECKS — all pass.

// Single (non-union) member: nothing to distribute, the result is just `T[]`:
expectTypeOf<ToArray<"a">>().toEqualTypeOf<"a"[]>();

// Two-member union: distribution produces a UNION of two array types...
expectTypeOf<ToArray<"a" | "b">>().toEqualTypeOf<"a"[] | "b"[]>();

// ...which is NOT the same as `("a" | "b")[]` (one array of mixed elements).
// A `("a" | "b")[]` is assignable to `"a"[] | "b"[]` but the two are not
// identical, and `not.toEqualTypeOf` confirms the distinction:
expectTypeOf<ToArray<"a" | "b">>().not.toEqualTypeOf<("a" | "b")[]>();

// 💡 This is EXACTLY why Topic 06's `Exclude<T, U>` filters unions: because
//    `T extends U ? never : T` distributes, each member is tested on its own,
//    and the matching ones become `never` (which then vanishes from the
//    union). Without distribution, Exclude would be near-useless.
//
// 💡 The rule applies ONLY to type parameters of the generic itself. A union
//    written inline — `(A | B) extends U ? X : Y` with no type variable — is
//    NOT distributed; it's tested as a whole. The "naked param" requirement is
//    the trigger.
