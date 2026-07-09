/**
 * PROMPT — Global augmentation (`Array.prototype`, `Window`)
 *
 * Built-in types like `Array<T>` and `Window` are GLOBAL interfaces declared in
 * lib.dom / lib.es5. You can extend them with `declare global { ... }` —
 * declaration merging into the global interface.
 *
 * Your job:
 *   1. Add `lastOr(fallback): T` to `Array<T>` via `declare global`.
 *   2. Add a `__kataBuild: string` property to `Window`.
 *   3. Provide the runtime implementation for `Array.prototype.lastOr` — the
 *      `declare global` block ONLY changes types; the method must also exist
 *      at runtime for it to actually work.
 *   4. Fix the CHECKS.
 *
 * Rules:
 *   - Keep augmentation INSIDE this file (already a module via the `@lib` import).
 *   - Don't reference the `window` VALUE at runtime — Node has no `window`.
 *     The `typeof window` TYPE query is fine (it's erased).
 *
 * Run:  npx tsc --noEmit 02-global-augment.problem.ts
 */

import { assert, describe, expectTypeOf } from "@lib";

// TODO: declare global { interface Array<T> { lastOr(fallback: T): T } interface Window { __kataBuild: string } }

// TODO: runtime implementation.
// Array.prototype.lastOr = function <T>(this: T[], fallback: T): T { ... };

// CHECKS — both augmentations must widen the built-in types.
// const nums = [1, 2, 3];
// expectTypeOf(nums.lastOr(0)).toEqualTypeOf<number>();
// expectTypeOf<typeof window>().toExtend<{ __kataBuild: string }>();

// describe("Array.prototype.lastOr", () => {
//   assert([1, 2, 3].lastOr(0) === 3, "returns last element");
//   assert([].lastOr(99) === 99, "returns fallback when empty");
// });
