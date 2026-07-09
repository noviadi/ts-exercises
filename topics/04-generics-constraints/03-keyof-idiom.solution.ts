/**
 * SOLUTION — The `K extends keyof T` idiom + multi-param inference
 *
 *   function get<T, K extends keyof T>(o: T, k: K): T[K]
 *
 * Three things make this work simultaneously:
 *   ① Two type parameters, T and K.
 *   ② The constraint `K extends keyof T` ties K to a real key of T.
 *   ③ The return type `T[K]` is an indexed access that resolves PER CALL SITE:
 *      K is inferred as a *literal* ("name") from the argument, so T[K]
 *      resolves to the property's exact type.
 *
 * Constraint + indexed access are inseparable here: without the constraint,
 * `T[K]` would be unsound. This same shape powers `Pick`, `get`, `omit`,
 * typed reducers, typed routers — everywhere.
 *
 * We also demonstrate multi-parameter inference with an `object` bound on a
 * `merge` helper that produces an intersection `A & B`.
 */

import { assert, assertEquals, describe, expectTypeOf } from "@lib";

type User = { id: number; name: string; active: boolean };

// The canonical idiom. Note the return type `T[K]` — that is the deliverable.
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  // explanation: because K is constrained to keyof T, `obj[key]` is a sound
  // property access (not an index-signature lookup), so its type is exactly
  // T[K] with no `| undefined` added by noUncheckedIndexedAccess.
  return obj[key];
}

// Multi-param inference with bounds: A and B must each be objects. The return
// type `A & B` is the intersection — for plain object literals that's the merge.
function merge<A extends object, B extends object>(a: A, b: B): A & B {
  // explanation: spreading two objects yields something assignable to A & B.
  // The explicit return type keeps the public type as the crisp intersection.
  return { ...a, ...b };
}

const u: User = { id: 7, name: "Ada", active: true };

// CHECKS — all passing.

// Per-call-site narrowing: each key resolves to its exact value type.
expectTypeOf(getProperty(u, "name")).toEqualTypeOf<string>();
expectTypeOf(getProperty(u, "id")).toEqualTypeOf<number>();
expectTypeOf(getProperty(u, "active")).toEqualTypeOf<boolean>();

// A key that isn't on User is rejected by the `K extends keyof T` constraint:
// @ts-expect-error  "email" is not assignable to `K extends keyof User`
getProperty(u, "email");

// merge infers A = {a:number}, B = {b:string}; result is A & B, which for
// object types normalises to the merged shape:
expectTypeOf(merge({ a: 1 }, { b: "x" })).toEqualTypeOf<{ a: number } & { b: string }>();
expectTypeOf(merge({ a: 1 }, { b: "x" })).toExtend<{ a: number; b: string }>();

// RUNTIME — the implementations behave.
describe("getProperty and merge behave", () => {
  assert(getProperty(u, "id") === 7, "getProperty id");
  assert(getProperty(u, "name") === "Ada", "getProperty name");

  const m = merge({ a: 1 }, { b: "x" });
  assertEquals(m, { a: 1, b: "x" }, "merge produces the merged object");
});

// 💡 Takeaways:
//   • `<T, K extends keyof T>` + `T[K]` is THE idiom for typed, per-key access.
//     Memorise it; you will write it constantly.
//   • The constraint is what makes the lookup sound — without it, callers could
//     pass arbitrary strings and `T[K]` would be meaningless.
//   • Multiple type params infer independently; bounds like `extends object`
//     keep each one in a useful part of the type space.
//   • This is the direct foundation for Topics 08 (mapped types), 43 (path
//     types), and 46 (typed event emitters).
