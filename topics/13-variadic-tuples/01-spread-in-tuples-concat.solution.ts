/**
 * SOLUTION — Spread `...T` in a tuple type; type `concat`
 *
 * The variadic-tuple feature lets a generic `T extends readonly unknown[]` be
 * spread *inside another tuple type*: `[...T, ...U]`. TypeScript then keeps
 * the tuple generic and computes the exact shape at the call site, preserving
 * both the length and the per-position element types.
 *
 *   - `T extends readonly unknown[]` is the canonical "array/tuple" constraint.
 *     `unknown[]` (rather than `any[]`) keeps element types flowing through
 *     unchanged and sound. `readonly` lets callers pass `as const` tuples.
 *
 *   - `function concat(...): Concat<T, U>` — by annotating the return type we
 *     force the precise spliced shape rather than the (widened) inferred array.
 *     The body is a plain `[...a, ...b]` spread; the *type* is what matters.
 */

import { describe, assert, expectTypeOf } from "@lib";

// explanation: spreading two generic tuples inside a tuple type produces the
// concatenated tuple. The `readonly` modifiers on the inputs do NOT leak into
// the result because the result type itself is declared mutable.
type Concat<T extends readonly unknown[], U extends readonly unknown[]> = [
  ...T,
  ...U,
];

function concat<T extends readonly unknown[], U extends readonly unknown[]>(
  a: T,
  b: U,
): Concat<T, U> {
  return [...a, ...b];
}

// CHECKS — all pass.

expectTypeOf<Concat<[1, 2], [3, 4, 5]>>().toEqualTypeOf<[1, 2, 3, 4, 5]>();
expectTypeOf<Concat<["a"], [boolean]>>().toEqualTypeOf<["a", boolean]>();
expectTypeOf<Concat<[], [9]>>().toEqualTypeOf<[9]>();

// Empty on either side still works — `Concat<[1, 2], []>` is `[1, 2]`.
expectTypeOf<Concat<[1, 2], []>>().toEqualTypeOf<[1, 2]>();

// The function's return type is exactly the spliced tuple:
const c = concat([1, 2] as const, ["x"] as const);
expectTypeOf<typeof c>().toEqualTypeOf<[1, 2, "x"]>();

// `as const` readonly tuples are accepted (because of the `readonly` bound):
const d = concat([true] as const, [3n, 4n] as const);
expectTypeOf<typeof d>().toEqualTypeOf<[true, 3n, 4n]>();

// Runtime: the function really does concatenate.
describe("concat runtime behaviour", () => {
  assert(c.length === 3, "concat produces length-3 tuple");
  assert(c[0] === 1 && c[1] === 2 && c[2] === "x", "values spliced in order");
  assert(d[0] === true && d[1] === 3n && d[2] === 4n, "bigint & bool splice");
});
