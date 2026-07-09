/**
 * SOLUTION — Prefix + suffix composition, and the "one generic middle spread" rule
 *
 * Composing three generic spreads is allowed: `[...P, ...M, ...S]`. At any
 * given call site each of P, M, S resolves to a concrete tuple, so TS just
 * splices them in order.
 *
 * THE BIG RULE (worth memorising): a tuple may contain at most ONE *generic*
 * spread of unknown length. Forms like `[A, ...T, B]` work because `A` and `B`
 * are single elements — only `...T` is a spread. But
 * `[...T, ...U, ...V]` where T, U, V are *all generic and unknown-length* is
 * forbidden, because TS cannot decide where T ends and U begins when
 * instantiating. The workaround is to constrain things so two of the three are
 * "known" or fixed, or to nest the spreads through a helper.
 *
 * This is why `[0, ...T, 99]` (below) is the canonical "wrap with boundaries"
 * pattern — the `0` and `99` are concrete single elements, so only `...T` is
 * variadic.
 */

import { describe, assert, expectTypeOf } from "@lib";

// explanation: three spreads, all generic, but each resolves to a known tuple
// at the call site. TS concatenates them positionally.
type Sandwich<
  P extends readonly unknown[],
  M extends readonly unknown[],
  S extends readonly unknown[],
> = [...P, ...M, ...S];

// explanation: this is the "[A, ...T, B]" shape. `0` and `99` are concrete
// single elements on either end; `...T` is the one allowed generic spread.
type WithBoundary<T extends readonly unknown[]> = [0, ...T, 99];

// CHECKS — all pass.

expectTypeOf<Sandwich<[1], [2, 3], [4]>>().toEqualTypeOf<[1, 2, 3, 4]>();
expectTypeOf<Sandwich<[], [1, 2], []>>().toEqualTypeOf<[1, 2]>();
expectTypeOf<Sandwich<[true], [], ["end"]>>().toEqualTypeOf<[true, "end"]>();

expectTypeOf<WithBoundary<[5, 6]>>().toEqualTypeOf<[0, 5, 6, 99]>();
expectTypeOf<WithBoundary<[]>>().toEqualTypeOf<[0, 99]>();
expectTypeOf<WithBoundary<readonly [1]>>().toEqualTypeOf<[0, 1, 99]>();

// The boundary pattern: first and last element are fixed by construction.
expectTypeOf<WithBoundary<[5, 6]>[0]>().toEqualTypeOf<0>();
type Last<S extends readonly unknown[]> = S extends readonly [
  ...unknown[],
  infer L,
]
  ? L
  : never;
expectTypeOf<Last<WithBoundary<[5, 6]>>>().toEqualTypeOf<99>();

// Demonstrating THE RULE: a single generic middle spread between concrete
// elements is fine, but TWO unknown-length generic spreads in a row produce an
// error during instantiation. We keep it commented out as a learning note:
//
//   type Bad<T extends readonly unknown[], U extends readonly unknown[]> =
//     [...T, ...U, "end"];
//
// This shape is allowed at the *declaration*, but TS will refuse to compute a
// concrete tuple when both T and U are non-empty, because the position of the
// "end" element is ambiguous. Always pin at least one boundary with a
// concrete element when you need two spreads.

// Runtime: a real `withBoundary` function — copies the tuple and wraps it.
function withBoundary<T extends readonly unknown[]>(tuple: T): WithBoundary<T> {
  return [0, ...tuple, 99];
}

describe("withBoundary runtime behaviour", () => {
  const r = withBoundary([5, 6] as const);
  assert(r.length === 4, "wraps with two boundary elements");
  assert(r[0] === 0 && r[3] === 99, "boundaries at both ends");
  assert(r[1] === 5 && r[2] === 6, "original elements preserved in the middle");
});
