/**
 * PROMPT — Spread `...T` in a tuple type; type `concat`
 *
 * Inside a tuple type you can write `...T` where `T` is a tuple/array type,
 * and TS will splice its element types into the position:
 *
 *     type A = [number, ...string[], boolean];   // number, then any number of
 *                                                // strings, then a boolean
 *
 * The real power is when `T` is a **generic** constrained to
 * `readonly unknown[]`: TS can then compute the resulting tuple shape from the
 * call site.
 *
 * Your job:
 *   1. Implement `Concat<T, U>` so that it splices two tuple types end-to-end.
 *   2. Implement `concat(a, b)` so its return type is `Concat<T, U>`.
 *
 * Run:  npx tsc --noEmit 01-spread-in-tuples-concat.problem.ts
 */

// TODO: implement.
type Concat<T extends readonly unknown[], U extends readonly unknown[]> = any;

// TODO: implement — return type must be `Concat<typeof a, typeof b>`.
function concat<T extends readonly unknown[], U extends readonly unknown[]>(
  a: T,
  b: U,
): any {
  return [...a, ...b];
}

import { expectTypeOf } from "@lib";

// CHECKS — fail until implemented.

expectTypeOf<Concat<[1, 2], [3, 4, 5]>>().toEqualTypeOf<[1, 2, 3, 4, 5]>();
expectTypeOf<Concat<["a"], [boolean]>>().toEqualTypeOf<["a", boolean]>();
expectTypeOf<Concat<[], [9]>>().toEqualTypeOf<[9]>();

const c = concat([1, 2] as const, ["x"] as const);
expectTypeOf<typeof c>().toEqualTypeOf<[1, 2, "x"]>();
