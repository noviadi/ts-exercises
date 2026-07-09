/**
 * PROMPT — The `K extends keyof T` idiom + multi-param inference
 *
 * The single most reused generic shape in TypeScript:
 *
 *     function get<T, K extends keyof T>(obj: T, key: K): T[K]
 *
 * `K extends keyof T` ties the key parameter to a REAL key of T. That is what
 * makes the return type `T[K]` sound AND lets each call site narrow precisely:
 * `get(u, "name")` returns `string`, `get(u, "id")` returns `number`.
 *
 * Tasks:
 *   1. Implement `getProperty<T, K extends keyof T>` returning `T[K]`.
 *   2. Implement `merge<A extends object, B extends object>(a, b): A & B`
 *      (multi-param inference + an object bound).
 *   3. Fix the CHECKS to describe the true types.
 *
 * Run:  npx tsc --noEmit 03-keyof-idiom.problem.ts
 */

type User = { id: number; name: string; active: boolean };

// TODO: the canonical idiom. Return T[K].
function getProperty<T, K extends keyof T>(obj: T, key: K): any {
  return obj[key];
}

// TODO: merge two objects into an intersection. Bound both params to `object`.
function merge<A, B>(a: A, b: B): any {
  return { ...a, ...b };
}

import { expectTypeOf } from "@lib";

const u: User = { id: 7, name: "Ada", active: true };

// CHECKS — fix to describe the truth.

expectTypeOf(getProperty(u, "name")).toEqualTypeOf<any>();
expectTypeOf(getProperty(u, "id")).toEqualTypeOf<any>();

// ❓ A bogus key — compile? Keep or @ts-expect-error.
expectTypeOf(getProperty(u, "email")).toEqualTypeOf<never>();

expectTypeOf(merge({ a: 1 }, { b: "x" })).toEqualTypeOf<any>();
