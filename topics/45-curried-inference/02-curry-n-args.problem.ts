/**
 * PROMPT — General N-argument curry
 *
 * Generalise `curry` to a function of ANY arity, supporting both call styles:
 *
 *   curry(fn)(1)(2)(3)        // one arg per step (fully split)
 *   curry(fn)(1, 2, 3)        // all args in one go
 *
 * All type parameters must be inferred from `fn`.
 *
 * Rules:
 *   - Fill in `Curry<F>` and implement `curry`.
 *   - Don't change the CHECKS.
 *
 * Design (read carefully — this is the canonical shape):
 *   Recurse over the parameter tuple `A = Parameters<F>`:
 *     - If `A` is `[First]` (one element left), the curried function takes
 *       `First` and returns `R`.
 *     - Otherwise `A` is `[First, ...Rest]`: the curried function is an
 *       intersection of TWO call signatures —
 *         (arg: First) => Curry<(...args: Rest) => R>     // apply one more
 *         (...args: A) => R                              // apply ALL remaining
 *
 * Hint: `Parameters<F>` / `ReturnType<F>` extract the arg tuple and return.
 *
 * Run:  npx tsc --noEmit 02-curry-n-args.problem.ts
 */

import { expectTypeOf } from "@lib";

// TODO: recursive conditional over the parameter tuple, as described above.
type Curry<F> = TODO;

// TODO: implement. The body legitimately needs internal looseness — comment why.
function curry<F extends (...args: any[]) => unknown>(fn: F): TODO {
  // ...
}

// CHECKS — both call shapes must typecheck and infer `number`.
const fn = (a: number, b: string, c: boolean): number => a + b.length + (c ? 1 : 0);
const c = curry(fn);

// Fully split (one arg per step):
expectTypeOf(c(1)("hi")(true)).toEqualTypeOf<number>();
// All at once:
expectTypeOf(c(1, "hi", true)).toEqualTypeOf<number>();

// After applying one arg, the remainder is itself a curried function:
expectTypeOf(c(1)).toEqualTypeOf<
  ((arg: string) => Curry<(c: boolean) => number>) & ((b: string, c: boolean) => number)
>;

// Wrong types rejected:
// @ts-expect-error  second arg must be string
c(1, 2, true);
