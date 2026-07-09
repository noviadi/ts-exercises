/**
 * PROMPT — 2-argument curry with full inference
 *
 * Write `curry<A, B, R>(fn)` so that BOTH call shapes work, with A, B, R
 * inferred from `fn` alone (callers never annotate):
 *
 *   curry(fn)(a)(b)    // partial application: first arg, then second
 *   curry(fn)(a, b)    // full application in one go
 *
 * Rules:
 *   - Fill in the return type `Curried2<A, B, R>` and the body.
 *   - Don't change the CHECKS.
 *
 * Hint: the return type needs two call signatures (an overload-like object
 * type) — one taking just `a` and returning `(b: B) => R`, one taking `(a, b)`
 * and returning `R`.
 *
 * Run:  npx tsc --noEmit 01-curry-two-args.problem.ts
 */

import { expectTypeOf } from "@lib";

// TODO: a type with two call signatures describing the two ways to call it.
type Curried2<A, B, R> = TODO;

// TODO: implement. The body can use a single implementation signature with an
// optional second parameter, cast to `Curried2<A, B, R>`.
function curry<A, B, R>(fn: (a: A, b: B) => R): Curried2<A, B, R> {
  // ...
}

// CHECKS — compile only when curry + Curried2 are correct.
const add = (a: number, b: string) => a + b.length;
const c = curry(add);

// Both call shapes are allowed, and R is inferred as `number`:
expectTypeOf(c(1)("hi")).toEqualTypeOf<number>();
expectTypeOf(c(1, "hi")).toEqualTypeOf<number>();

// Wrong-typed args are rejected:
// @ts-expect-error  first arg must be number, not string
c("x")("hi");
// @ts-expect-error  second arg must be string, not number
c(1)(2);
