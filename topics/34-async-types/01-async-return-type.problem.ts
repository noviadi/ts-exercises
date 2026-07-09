/**
 * PROMPT — Typing an async function's return
 *
 * Every `async` function returns a Promise, regardless of what its body
 * `return`s. TypeScript infers the *element* type of that promise by recursively
 * unwrapping any inner promise the body might produce. Concretely:
 *
 *   async function f(): T           =>  inferred return type is Promise<T>
 *   async function f(): Promise<T>  =>  inferred return type is Promise<T>
 *                                         (NOT Promise<Promise<T>>!)
 *   async function f(): Promise<Promise<T>> => still Promise<T>  (flattened)
 *   async function with no `return`  =>  Promise<void>
 *
 * Your job:
 *   1. For each function below, predict its inferred return type.
 *   2. Fill in the `expectTypeOf<ReturnType<…>>().toEqualTypeOf<…>()` checks
 *      with the correct target type.
 *   3. Implement `asyncReturnType` — a tiny utility type alias that maps a
 *      declared body type `B` to the inferred async-return type, matching TS's
 *      own inference.
 *
 * Rules:
 *   - Use `Awaited<B>` from the standard library where appropriate.
 *
 * Run:  npx tsc --noEmit 01-async-return-type.problem.ts
 */

// TODO: implement the utility type.
// type AsyncReturn<B> = ???;

async function returnsNumber(): Promise<number> {
  return 7;
}

// Note: NO explicit return annotation on this one — let TS infer it.
async function returnsNested() {
  return Promise.resolve(Promise.resolve(7));
}

async function returnsVoid(): Promise<void> {}

async function returnsBareValue(): Promise<number> {
  return 42;
}

import { expectTypeOf } from "@lib";

// CHECKS — fix each to reflect the true inferred type.

// expectTypeOf<AsyncReturn<number>>().toEqualTypeOf<???>();
// expectTypeOf<AsyncReturn<Promise<number>>>().toEqualTypeOf<???>();
// expectTypeOf<AsyncReturn<void>>().toEqualTypeOf<???>();
// expectTypeOf<ReturnType<typeof returnsNumber>>().toEqualTypeOf<???>();
// expectTypeOf<ReturnType<typeof returnsVoid>>().toEqualTypeOf<???>();
