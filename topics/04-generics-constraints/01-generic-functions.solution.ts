/**
 * SOLUTION — Generic functions: declaring `<T>` and reading inference
 *
 *   <T>            one type parameter, inferred from the call site
 *   <A, B>         several type parameters, each inferred independently
 *
 * Inference is the heart of generics: you almost NEVER write the type
 * arguments at the call site. TS looks at the arguments and fills them in.
 *
 * Watch `noUncheckedIndexedAccess`: `arr[0]` is `T | undefined` (the array
 * could be empty), so `first` MUST return `T | undefined` to stay honest.
 */

// `identity<T>`: T is inferred from `x`. Return type `T` mirrors it exactly.
function identity<T>(x: T): T {
  return x;
}

// `first<T>`: T is inferred from the array ELEMENT type, not the array itself.
// Because `noUncheckedIndexedAccess` is on, `arr[0]` is `T | undefined`.
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// `pair<A, B>`: two independent parameters. TS infers A and B separately from
// the two arguments, so `pair(1, "x")` is `[number, string]`. Returning a
// tuple literal preserves both element types exactly.
function pair<A, B>(a: A, b: B): [A, B] {
  // explanation: the tuple return type `[A, B]` (rather than `(A | B)[]`)
  // is what keeps the per-position types distinct at the call site.
  return [a, b];
}

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — every call site infers its own concrete type.

expectTypeOf(identity(42)).toEqualTypeOf<number>();
expectTypeOf(identity("hi")).toEqualTypeOf<string>();
expectTypeOf(identity({ a: 1 })).toEqualTypeOf<{ a: number }>();

// `first` returns `T | undefined` — the empty-array case is real:
expectTypeOf(first([1, 2, 3])).toEqualTypeOf<number | undefined>();
expectTypeOf(first(["a", "b"])).toEqualTypeOf<string | undefined>();

// `pair` infers a 2-tuple with the right type at each position:
expectTypeOf(pair(1, "x")).toEqualTypeOf<[number, string]>();
// (literal arguments WIDEN when inferred: `true` -> `boolean`, `null` -> `null`.)
expectTypeOf(pair(true, null)).toEqualTypeOf<[boolean, null]>();

// RUNTIME — prove the implementations behave.
describe("generic functions behave at runtime", () => {
  assert(identity(42) === 42, "identity<number>");
  assert(identity("hi") === "hi", "identity<string>");

  assert(first([1, 2, 3]) === 1, "first of numbers");
  assert(first([]) === undefined, "first of empty -> undefined");

  const p = pair(1, "x");
  assert(p[0] === 1 && p[1] === "x", "pair preserves both values");
});

// 💡 Takeaways:
//   • Let inference do the work — only rarely write explicit type args
//     (`identity<number>(...)`). Explicit args are for disambiguation.
//   • Multi-param generics infer EACH parameter from its own argument; if two
//     args must share a type, give them the SAME parameter name (`<T>(a: T, b: T)`).
//   • Respect `noUncheckedIndexedAccess`: array access yields `T | undefined`,
//     and your return type should say so.
