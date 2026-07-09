/**
 * SOLUTION — 2-argument curry with full inference
 *
 * The whole game is the RETURN TYPE. `curry` itself is trivially generic in
 * `<A, B, R>` and TS infers all three from the single `fn` argument — nothing
 * surprising. The interesting part is that the returned function must support
 * TWO different call shapes:
 *
 *     (a: A) => (b: B) => R          // partial application
 *     (a: A, b: B) => R              // full application
 *
 * A plain function type has exactly one signature, so we need an object type
 * with MULTIPLE call signatures (just like an overload declaration, but as a
 * type). Call sites then dispatch on how many args they pass.
 *
 * The implementation body uses one loose implementation signature
 * `(a: A, b?: B)` and is cast to the precise `Curried2<A, B, R>`. The cast is
 * honest: when `b` is present we call `fn` directly; when absent we return a
 * closure that waits for it.
 */

import { expectTypeOf } from "@lib";

// explanation: two call signatures on one type. TS picks the matching one by
// argument count/shape at each call site, exactly like overload resolution.
type Curried2<A, B, R> = {
  (a: A): (b: B) => R;
  (a: A, b: B): R;
};

function curry<A, B, R>(fn: (a: A, b: B) => R): Curried2<A, B, R> {
  // explanation: one implementation signature covering both overloads. `b` is
  // optional; we detect "not supplied" at runtime via `undefined`. Under
  // `exactOptionalPropertyTypes` an optional PARAMETER still permits being
  // absent, and reading it yields `B | undefined`.
  const curried = (a: A, b?: B): R | ((b: B) => R) => {
    if (b === undefined) return (bb: B) => fn(a, bb);
    return fn(a, b);
  };
  return curried as Curried2<A, B, R>;
}

// --- CHECKS ---------------------------------------------------------------

const add = (a: number, b: string) => a + b.length;
const c = curry(add);

// The returned value is callable in two ways, both yielding `number`:
expectTypeOf(c(1)("hi")).toEqualTypeOf<number>();
expectTypeOf(c(1, "hi")).toEqualTypeOf<number>();

// Wrong-typed args are rejected at the call site:
// @ts-expect-error  first arg must be number, not string
c("x")("hi");
// @ts-expect-error  second arg must be string, not number
c(1)(2);

// 💡 Why not just `(a: A, b?: B) => R | ((b: B) => R)`? Because that lets the
//    caller treat the return as EITHER branch at every step — you'd lose the
//    "called with one arg ⇒ definitely returns a function" correlation. The
//    two-signature object type restores that correlation: the number of args
//    you pass determines the return type precisely.
