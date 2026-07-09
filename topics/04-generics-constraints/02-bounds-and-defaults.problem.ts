/**
 * PROMPT — Generic bounds (`T extends U`) and defaults (`T = U`)
 *
 * A bare `<T>` lets T be ANYTHING — which means inside the body you can do
 * almost nothing with a value of type T. A **constraint** `T extends U`
 * restricts T to types assignable to U, and as a reward, you may use U's
 * members (e.g. `x.length`) inside the body.
 *
 * A **default** `T = U` is used when inference can't pin T down — handy for
 * factories with optional arguments, or to make a generic friendlier.
 *
 * Tasks:
 *   1. Implement `getLength` so it works for `string`, arrays, tuples — anything
 *      with a `.length`. (Hint: bound T with `{ length: number }`.)
 *   2. Implement `makeContainer` so that with NO type argument T defaults to
 *      `string`, and with `<number>` it becomes `{ contents: number | undefined }`.
 *   3. Fix the CHECKS to describe the true types.
 *
 * Run:  npx tsc --noEmit 02-bounds-and-defaults.problem.ts
 */

// TODO: bound T so the body may legally read `x.length`. Return number.
function getLength<T>(x: T): number {
  return (x as any).length;
}

// TODO: give T a default of `string`. Return `{ contents: T | undefined }`.
function makeContainer<T>(): { contents: T | undefined } {
  return { contents: undefined };
}

import { expectTypeOf } from "@lib";

// CHECKS — fix to describe the truth.

expectTypeOf(getLength("abc")).toEqualTypeOf<any>();
expectTypeOf(getLength([1, 2, 3])).toEqualTypeOf<any>();

// ❓ A number has no `.length` — does this compile? Keep or @ts-expect-error.
expectTypeOf(getLength(123)).toEqualTypeOf<number>();

// Default kicks in when no type arg & no inference:
expectTypeOf(makeContainer()).toEqualTypeOf<{ contents: any }>();

// Explicit type arg overrides the default:
expectTypeOf(makeContainer<number>()).toEqualTypeOf<{ contents: number | undefined }>();
