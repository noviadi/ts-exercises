/**
 * PROMPT — `infer` on tuples & generics: `Parameters` and `Promise<T>`
 *
 * `infer` works on ANY shape, not just return types. Two classic targets:
 *
 *   1. Function parameter tuples — match `(...args: infer P) => unknown` and
 *      `P` is inferred as a *tuple* of the parameter types.
 *   2. Generic containers — match `Promise<infer U>` and `U` is the element.
 *
 * Your job:
 *   - Implement `MyParameters<T>` (returns the parameter tuple, or `never`).
 *   - Implement `PromiseValue<T>` (returns the resolved value, or `never`).
 *
 * Run:  npx tsc --noEmit 02-parameters-and-promise.problem.ts
 */

// TODO: infer the parameter tuple of a function.
type MyParameters<T> = TODO;

// TODO: infer the element type of a Promise.
type PromiseValue<T> = TODO;

// ---------------------------------------------------------------------------
// Fix the types above; the CHECKS below must compile once you do.
// ---------------------------------------------------------------------------

import { expectTypeOf } from "@lib";

type Greet = (name: string, age: number) => boolean;
type AsyncResult = Promise<{ ok: true }>;

// CHECKS — these fail until both types are correct.
expectTypeOf<MyParameters<Greet>>().toEqualTypeOf<[string, number]>();
expectTypeOf<MyParameters<Greet>>().toExtend<readonly unknown[]>();
expectTypeOf<PromiseValue<AsyncResult>>().toEqualTypeOf<{ ok: true }>();
expectTypeOf<PromiseValue<Promise<Date>>>().toEqualTypeOf<Date>();
