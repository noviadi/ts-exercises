/**
 * SOLUTION — `infer` on tuples & generic containers
 *
 * `infer` is a general pattern-matching bind. The position where you write
 * `infer X` decides what gets captured:
 *
 *   • `(...args: infer P) => unknown`  → `P` is the parameter TUPLE
 *   • `Promise<infer U>`               → `U` is the container's element
 *   • `(arg: Array<infer E>) => void`   → `E` is the array's element
 *
 * Key insight: `infer` produces a **tuple** when it sits in a rest-parameter
 * position. That is precisely how `Parameters<T>` recovers the ordered list of
 * a function's arguments as a tuple type.
 */

// explanation: matching `(...args: infer P) => unknown` captures `P` as a
// tuple `[arg0, arg1, ...]` mirroring the function's parameter list. We use
// `unknown` (not `any`) as the return position — we don't care about it, and
// `unknown` is the safe top type for return-type contravariance.
type MyParameters<T extends (...args: any[]) => unknown> =
  T extends (...args: infer P) => unknown ? P : never;

// explanation: matching `Promise<infer U>` opens up the generic container.
// `U` is whatever type argument the Promise was constructed with. If `T` is
// not a Promise at all, we fall through to `never`.
type PromiseValue<T> = T extends Promise<infer U> ? U : never;

import { expectTypeOf } from "@lib";

type Greet = (name: string, age: number) => boolean;
type AsyncResult = Promise<{ ok: true }>;

// CHECKS — read each as a documentation line of the model.

// The whole parameter tuple is recovered, in order, as a tuple type:
expectTypeOf<MyParameters<Greet>>().toEqualTypeOf<[string, number]>();
// A parameter tuple is, of course, an array-like:
expectTypeOf<MyParameters<Greet>>().toExtend<readonly unknown[]>();

// Pulling the element out of a Promise of an object literal:
expectTypeOf<PromiseValue<AsyncResult>>().toEqualTypeOf<{ ok: true }>();
// And out of a Promise of a class:
expectTypeOf<PromiseValue<Promise<Date>>>().toEqualTypeOf<Date>();

// 💡 Why the constraint on MyParameters (`T extends (...args: any[]) => unknown`)?
//    It mirrors the built-in `Parameters<T>` so that calling MyParameters on a
//    non-function is rejected at the CALL SITE rather than silently returning
//    `never`. Try removing it and MyParameters<number> would just yield `never`.

// @ts-expect-error  number does not satisfy the constraint `(...args: any[]) => unknown`
type _BadCall = MyParameters<number>;
