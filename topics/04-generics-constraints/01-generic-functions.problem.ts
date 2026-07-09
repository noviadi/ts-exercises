/**
 * PROMPT — Generic functions: declaring `<T>` and reading inference
 *
 * A generic function declares one or more **type parameters** in angle
 * brackets. TypeScript INFERS them at each call site from the argument types,
 * so the same function works for `number`, `string`, … without losing types.
 *
 * Tasks:
 *   1. Implement `identity`, `first`, and `pair` so the CHECKS pass.
 *      - `first` must return `T | undefined` (the array might be empty).
 *   2. Fix the CHECKS to describe the inferred types.
 *
 * Run:  npx tsc --noEmit 01-generic-functions.problem.ts
 */

// TODO: return exactly what you receive, typed as T.
function identity<T>(x: T): any {
  return x;
}

// TODO: return the first element, or undefined if empty. Remember
// `noUncheckedIndexedAccess` makes `arr[0]` into `T | undefined`.
function first<T>(arr: T[]): any {
  return arr[0];
}

// TODO: a two-parameter generic returning a tuple [A, B].
function pair<A, B>(a: A, b: B): any {
  return [a, b];
}

import { expectTypeOf } from "@lib";

// CHECKS — fix the inferred types.

expectTypeOf(identity(42)).toEqualTypeOf<any>();
expectTypeOf(identity("hi")).toEqualTypeOf<any>();

expectTypeOf(first([1, 2, 3])).toEqualTypeOf<any>();
expectTypeOf(first(["a", "b"])).toEqualTypeOf<any>();

expectTypeOf(pair(1, "x")).toEqualTypeOf<any>();
