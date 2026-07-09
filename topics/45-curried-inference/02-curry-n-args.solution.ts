/**
 * SOLUTION — General N-argument curry
 *
 * We recurse over the parameter tuple `A = Parameters<F>` and, at each step,
 * expose TWO ways to make progress:
 *
 *   (arg: First) => Curry<(...args: Rest) => R>     // apply ONE arg, recurse
 *   (...args: A) => R                              // apply ALL remaining args
 *
 * Those two live as an INTERSECTION of call signatures on the returned
 * function, so the caller can either feed one argument and keep going, or feed
 * every remaining argument at once and finish.
 *
 *   type Curry<F> =
 *     F extends (...args: infer A) => infer R
 *       ? A extends [infer First, ...infer Rest]
 *         ? Rest extends []
 *           ? (arg: First) => R                 // last arg — done after this
 *           : ((arg: First) => Curry<(...args: Rest) => R>)
 *             & ((...args: A) => R)
 *         : () => R                             // 0-arg function
 *       : never;
 *
 * The recursion terminates because `Rest` is strictly shorter than `A` each
 * step, bottoming out at the single-element case (`Rest extends []`).
 *
 * Implementation honesty: the BODY of a variadic curry cannot be typed
 * precisely — it would need to prove that a runtime spread reconstructs a tuple
 * of exactly `fn.length`, which TS can't do. So the interior uses `unknown[]`
 * and we cast the result to the precise `Curry<F>`. The PUBLIC type callers see
 * is fully precise; the looseness is sealed inside this one function.
 *
 * Limitation: this design supports "one arg per step" OR "all remaining args at
 * once", but NOT arbitrary mixed prefixes like `c(1, "hi")(true)`. Supporting
 * those requires prefix-subtraction machinery that is notoriously fragile under
 * TS's inference (the `Partial<A>` approach wrongly widens to the full tuple).
 * See type-challenges "Curry" (hard) for that heavier formulation.
 */

import { expectTypeOf } from "@lib";

// explanation: the recursive conditional. Note `Rest extends []` is the base
// case — exactly one argument left, so calling with it yields `R` directly.
// The intersection `& ((...args: A) => R)` is what enables the all-at-once call.
type Curry<F> = F extends (...args: infer A) => infer R
  ? A extends [infer First, ...infer Rest]
    ? Rest extends []
      ? (arg: First) => R
      : ((arg: First) => Curry<(...args: Rest) => R>) & ((...args: A) => R)
    : () => R
  : never;

// explanation: the constraint `F extends (...args: any[]) => unknown` uses
// `any[]` because no finite tuple type is a supertype of every function's
// params — this `any` is load-bearing and confined to the constraint.
function curry<F extends (...args: any[]) => unknown>(fn: F): Curry<F> {
  const curried = (...args: unknown[]): unknown => {
    if (args.length >= fn.length) {
      return (fn as (...a: unknown[]) => unknown)(...args);
    }
    return (...next: unknown[]): unknown => curried(...args, ...next);
  };
  return curried as Curry<F>;
}

// --- CHECKS — both call shapes infer `number` ------------------------------

const fn = (a: number, b: string, c: boolean): number =>
  a + b.length + (c ? 1 : 0);
const c = curry(fn);

// Fully split (one arg per step):
expectTypeOf(c(1)("hi")(true)).toEqualTypeOf<number>();
// All at once:
expectTypeOf(c(1, "hi", true)).toEqualTypeOf<number>();

// explanation: after applying `1`, the value is the intersection described in
// the header — call it with one more arg to recurse, or with both to finish.
expectTypeOf(c(1)).toEqualTypeOf<
  ((arg: string) => Curry<(c: boolean) => number>) & ((b: string, c: boolean) => number)
>();

// Wrong types rejected at the call site:
// @ts-expect-error  second arg must be string
c(1, 2, true);

// 💡 Why an intersection and not a union? A union of call signatures would let
//    the caller treat the return as EITHER branch, losing the correlation
//    between "how many args I passed" and "what I got back". The intersection
//    keeps both signatures available, and TS's overload resolution picks the
//    one matching the actual argument count — preserving precision.
