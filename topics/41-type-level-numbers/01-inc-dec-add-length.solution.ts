/**
 * SOLUTION — Naturals as tuples: Inc / Dec / Add / Length
 *
 * The big idea: a tuple type carries its `length` as a literal number type, so
 * "a tuple of length N" IS the natural number N at the type level.
 *
 *   type Zero = readonly [];                       // length 0
 *   type One   = readonly [unknown];               // length 1
 *   type Two   = readonly [unknown, unknown];      // length 2
 *
 * `unknown` is the filler element — we never look at the elements, only at the
 * length, so we pick the most inert element type possible (no `any`: it would
 * silently satisfy every check and hide bugs).
 *
 * ── The four operations, mechanically ─────────────────────────────────────────
 *
 *   • `Inc<N>`   = `[...N, unknown]`        — append one element  → length + 1
 *   • `Dec<N>`   = match `[unknown, ...Rest]` and return `Rest`   → length − 1
 *   • `Add<A,B>` = `[...A, ...B]`           — concatenation       → lengths add
 *   • `Length<N>`= `N["length"]`            — read the literal
 *
 * Variadic spreads (`...A`) in tuple literals are the feature that makes
 * `Inc`/`Add` work: a `readonly unknown[]` (or narrower tuple) spread into a
 * tuple literal contributes exactly its elements.
 *
 * `Dec` uses a conditional + `infer Rest` to destructure the tuple: "if N looks
 * like `[head, ...tail]`, give me the tail". `readonly []` does not match that
 * pattern, so the `else` branch returns `Zero` — i.e. we clamp at 0 (dec 0 == 0)
 * rather than producing `never`.
 */

import type { IsEqual } from "@lib";
import { assert, describe, expectTypeOf } from "@lib";

// A natural N is encoded as a tuple of length N (readonly so we can't mutate it
// at runtime either — it's a type, but the discipline is nice).
type Nat = readonly unknown[];
type Zero = readonly [];

// explanation: spread the existing tuple and tack one `unknown` on the end.
// `[...N, unknown]` is the variadic-tuple "push".
type Inc<N extends Nat> = readonly [...N, unknown];

// explanation: destructure with infer. `readonly [unknown, ...infer Rest]`
// matches any non-empty readonly tuple; `Rest` binds to everything but the head.
// We re-spread into `readonly [...]` so the result stays `readonly` (matching
// our `Nat` convention) — `infer` alone would yield a *mutable* tuple, which
// would not be identical to our readonly literals. The empty tuple doesn't
// match, so we fall through to `Zero` → clamp at 0.
type Dec<N extends Nat> = N extends readonly [unknown, ...infer Rest]
  ? readonly [...Rest]
  : Zero;

// explanation: tuple concatenation. Spreading two tuples into one literal
// gives a tuple whose length is the sum — that's literally Peano addition.
type Add<A extends Nat, B extends Nat> = readonly [...A, ...B];

// explanation: indexed access on `length`. Because `N` is a *tuple* (not
// `unknown[]`), `N["length"]` is the literal number type, not just `number`.
type Length<N extends Nat> = N["length"];

// Hand-built literals for the checks.
type _1 = readonly [unknown];
type _2 = readonly [unknown, unknown];
type _3 = readonly [unknown, unknown, unknown];

// CHECKS — compile-time proof of each operation.
expectTypeOf<Inc<Zero>>().toEqualTypeOf<_1>();
expectTypeOf<Inc<_2>>().toEqualTypeOf<_3>();

// Dec pops one element off the front; the tail of a 3-tuple is a 2-tuple.
expectTypeOf<Dec<_3>>().toEqualTypeOf<_2>();
// Dec of Zero clamps to Zero (the conditional's else branch).
expectTypeOf<Dec<Zero>>().toEqualTypeOf<Zero>();

// Add = concatenation. Lengths add up.
expectTypeOf<Add<_1, _2>>().toEqualTypeOf<_3>();
expectTypeOf<Add<_2, _2>>().toEqualTypeOf<
  readonly [unknown, unknown, unknown, unknown]
>();

// Length reads the literal back as a number type.
expectTypeOf<Length<_3>>().toEqualTypeOf<3>();
expectTypeOf<Length<Add<_2, _3>>>().toEqualTypeOf<5>();

// Composition: Inc ∘ Inc ∘ Inc ∘ Zero is a 3-tuple, length 3.
expectTypeOf<Length<Inc<Inc<Inc<Zero>>>>>().toEqualTypeOf<3>();

// RUNTIME — there is no runtime arithmetic here; this just sanity-checks that
// our type aliases also describe real values you could construct.
describe("01-inc-dec-add-length sanity", () => {
  // A value of type `_3` really is a 3-element array of `unknown`s.
  const three: _3 = [0, 1, 2];
  assert(three.length === 3, "tuple length matches the encoded natural");

  // The encoding is purely structural: any 3-tuple is a `_3`.
  const alsoThree: _3 = ["a", "b", "c"];
  assert(alsoThree.length === 3, "any 3-tuple is the natural 3");

  // IsEqual sanity: Add<_1,_2> and _3 are structurally identical.
  type _sum = Add<_1, _2>;
  const check: IsEqual<_sum, _3> = true;
  assert(check, "Add<_1,_2> is identical to _3");
});
