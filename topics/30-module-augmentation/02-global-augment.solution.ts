/**
 * SOLUTION — Global augmentation (`Array.prototype`, `Window`)
 *
 * `declare global { ... }` merges into the GLOBAL interfaces declared by
 * lib.es5/lib.dom. Adding `lastOr` to `interface Array<T>` makes
 * `Array.prototype.lastOr` type-check on every array; adding `__kataBuild` to
 * `interface Window` makes the property readable off `window`.
 *
 * CRUCIAL: augmentation changes TYPES only. If you also need the method to work
 * at runtime (we do, for `lastOr`), you must separately assign the
 * implementation to the prototype. The `declare global` block does NOT create
 * the value.
 *
 * `Window` here is a type-only demonstration — we never touch the `window`
 * VALUE, so this file runs fine under Node (no DOM). `typeof window` is a TYPE
 * query that the compiler erases.
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation: merge into the built-in global interfaces. The same declaration-
// merging rule from Topic 23 applies — these are interface declarations with
// the same name as the lib ones, so members are unioned in.
declare global {
  interface Array<T> {
    // Returns the last element, or `fallback` when the array is empty.
    lastOr(fallback: T): T;
  }

  interface Window {
    // A project-wide flag we pretend some bootstrap script sets on `window`.
    __kataBuild: string;
  }
}

// explanation: the runtime half. `Array.prototype` is the object every array
// inherits from; assigning `lastOr` here makes the method actually callable.
// The `this: T[]` parameter gives TypeScript the receiver type so the element
// type `T` is inferred correctly. Under `noUncheckedIndexedAccess`, indexing
// returns `T | undefined`, so we use `!` after confirming the array is non-empty.
Array.prototype.lastOr = function <T>(this: T[], fallback: T): T {
  return this.length > 0 ? this[this.length - 1]! : fallback;
};

// CHECKS — prove both augmentations widened the built-ins.

const nums = [1, 2, 3];
// The call site sees the augmented method and infers `number`:
expectTypeOf(nums.lastOr(0)).toEqualTypeOf<number>();

// explanation: an empty literal `[]` would be inferred as `never[]`, making
// `T` collapse to `never` and rejecting any non-never fallback. Typing the
// empty array as `number[]` keeps the element type pinned so the fallback
// checks against `number`:
const emptyNums: number[] = [];
expectTypeOf(emptyNums.lastOr(0)).toEqualTypeOf<number>();

// `Window` now has the augmented property at the TYPE level:
expectTypeOf<Window>().toExtend<{ __kataBuild: string }>();
// And the value `window` reflects the augmented type (type query only —
// erased at runtime, so no DOM access happens):
expectTypeOf<typeof window>().toExtend<{ __kataBuild: string }>();

// Runtime check for the real behaviour we just implemented.
describe("Array.prototype.lastOr", () => {
  assert(nums.lastOr(0) === 3, "returns last element");
  const emptyNumsRun: number[] = [];
  assert(emptyNumsRun.lastOr(99) === 99, "returns fallback when empty");

  // element type is preserved for non-number arrays too:
  const words = ["a", "b"];
  assert(words.lastOr("?") === "b", "string element type preserved");
});
