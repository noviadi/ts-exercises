/**
 * SOLUTION — Type `push` and `unshift` with the `readonly unknown[]` constraint
 *
 * The same `[...T, X]` / `[X, ...T]` spread, now adding a SINGLE element to one
 * end. The constraint on `T` is the load-bearing part:
 *
 *     T extends readonly unknown[]
 *
 * Why `readonly`?  So the caller can pass an `as const` tuple (which is
 * `readonly`). Why `unknown`?  So the element types flow through unchanged,
 * rather than being polluted by `any`. The RESULT is written as a fresh
 * mutable tuple `[...T, V]` — writing the result without `readonly` strips the
 * readonly-ness, which is exactly what you want for a "pushed" copy.
 *
 * Note: these return NEW tuples; they do not mutate in place. That keeps the
 * types honest — `readonly` inputs cannot be mutated, only re-derived.
 */

import { describe, assert, expectTypeOf } from "@lib";

// explanation: `[...T, V]` splices all of T's elements, then `V`. Because the
// result is written without `readonly`, the resulting tuple is mutable even if
// `T` was readonly.
type Push<T extends readonly unknown[], V> = [...T, V];

// explanation: `[V, ...T]` — `V` first, then everything from `T`. Same
// "no readonly on the result" trick.
type Unshift<T extends readonly unknown[], V> = [V, ...T];

// CHECKS — all pass.

expectTypeOf<Push<[1, 2], 3>>().toEqualTypeOf<[1, 2, 3]>();
expectTypeOf<Push<[], "x">>().toEqualTypeOf<["x"]>();

expectTypeOf<Unshift<[2, 3], 1>>().toEqualTypeOf<[1, 2, 3]>();
expectTypeOf<Unshift<[], 0>>().toEqualTypeOf<[0]>();

// Pushing onto a READONLY input still yields a mutable result:
expectTypeOf<Push<readonly ["a"], "b">>().toEqualTypeOf<["a", "b"]>();
expectTypeOf<Unshift<readonly [2, 3], 1>>().toEqualTypeOf<[1, 2, 3]>();

// Length is precise — `Push` adds exactly one to the tuple length:
expectTypeOf<Push<[1, 2], 3>["length"]>().toEqualTypeOf<3>();
expectTypeOf<Unshift<[2, 3], 1>["length"]>().toEqualTypeOf<3>();

// A tiny runtime helper demonstrating the technique, returning a new tuple.
function push<T extends readonly unknown[], V>(tuple: T, value: V): Push<T, V> {
  return [...tuple, value];
}
function unshift<T extends readonly unknown[], V>(
  tuple: T,
  value: V,
): Unshift<T, V> {
  return [value, ...tuple];
}

describe("push / unshift runtime behaviour", () => {
  const r1 = push([1, 2] as const, 3);
  assert(r1.length === 3 && r1[2] === 3, "push appends value");

  const r2 = unshift([2, 3] as const, 1);
  assert(r2.length === 3 && r2[0] === 1, "unshift prepends value");
});
