/**
 * SOLUTION — Type-level If<C, A, B>
 *
 * A conditional type `C extends true ? A : B` IS a type-level `if`. Wrap it
 * in a generic and you have `If`:
 *
 *     type If<C extends boolean, A, B = never> =
 *       C extends true ? A : B;
 *
 * Notes:
 *   - `C extends boolean` constrains the condition to a boolean (so callers
 *     can't pass `string` and get nonsense).
 *   - `B = never` makes the "else" branch default to `never` — i.e. "no
 *     value" — which is exactly what you want when only the truthy case
 *     produces a meaningful result.
 *   - Distribution: because `C` is a naked type parameter, `If<boolean, A, B>`
 *     resolves to `A | B`. That's a feature: a condition you don't know yet
 *     yields the union of both branches.
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation: the type-level if. `B` defaults to `never`, so calling
// `If<true, T>` (with no third arg) yields `T`, and `If<false, T>` yields `never`.
type If<C extends boolean, A, B = never> = C extends true ? A : B;

// CHECKS — concrete branches.

expectTypeOf<If<true, string, number>>().toEqualTypeOf<string>();
expectTypeOf<If<false, string, number>>().toEqualTypeOf<number>();

// Defaulted "else" is `never` — the empty type. Useful for "this case has no value":
expectTypeOf<If<true, string>>().toEqualTypeOf<string>();
expectTypeOf<If<false, string>>().toBeNever();

// Branch with complex types (objects) works the same way:
expectTypeOf<
  If<true, { ok: true; value: string }, { ok: false; error: Error }>
>().toEqualTypeOf<{ ok: true; value: string }>();
expectTypeOf<
  If<false, { ok: true; value: string }, { ok: false; error: Error }>
>().toEqualTypeOf<{ ok: false; error: Error }>();

// Distribution: an unknown condition returns the UNION of both branches.
expectTypeOf<If<boolean, string, number>>().toEqualTypeOf<string | number>();
expectTypeOf<If<boolean, "a", "b">>().toEqualTypeOf<"a" | "b">();

// Composition: nest If to build a small type-level decision tree. Pick the
// element type of a container based on a feature flag:
type Container<IsArray extends boolean> = If<
  IsArray,
  number[],
  Set<number>
>;
expectTypeOf<Container<true>>().toEqualTypeOf<number[]>();
expectTypeOf<Container<false>>().toEqualTypeOf<Set<number>>();

// RUNTIME — the type-level If is compile-time only, but it cleanly types a
// runtime function that must branch. Here the RETURN type tracks the boolean
// flag the caller passes, so callers get a narrower type than `string | null`.
function maybe<On extends boolean>(flag: On): If<On, string> {
  // explanation: at runtime we always run the branch; the TYPE lets each call
  // site see only the branch that flag selects. `as If<On, string>` is the
  // bridge — we the author guarantee the invariant the type promises.
  return (flag ? "yes" : null) as If<On, string>;
}

describe("02-type-level-if runtime checks", () => {
  const whenTrue = maybe(true);
  const whenFalse = maybe(false);

  // Compile-time: whenTrue is exactly `string`, whenFalse is exactly `never`.
  expectTypeOf<typeof whenTrue>().toEqualTypeOf<string>();
  expectTypeOf<typeof whenFalse>().toBeNever();

  // Runtime: the truthy branch really returned "yes".
  assert(whenTrue === "yes", "truthy branch returned the string");
  // whenFalse is `null` at runtime even though its type is `never` — the type
  // tells callers "there is no value to use here", which is the point.
  assert(whenFalse === null, "falsy branch is null at runtime (typed as never)");
});
