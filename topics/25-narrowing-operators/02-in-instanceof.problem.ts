/**
 * PROMPT — `in` and `instanceof` narrowing
 *
 * `in` narrows by checking whether a property exists on an object — perfect for
 * telling apart shapes that have no shared discriminant tag. `instanceof`
 * narrows to a class's prototype, exposing its methods inside the branch.
 *
 * Tasks:
 *   1. Implement `area(shape)` using `in` to discriminate `Circle` vs `Square`.
 *      Each branch should be narrowed so `.radius` / `.size` are safe to read.
 *   2. Implement `wrap(err: unknown)` using `instanceof` to detect a
 *      `TypeError` (a built-in subclass of `Error`), returning its `.message`
 *      or a fallback.
 *
 * Rules:
 *   - Use the `in` operator and `instanceof` respectively — no custom guards.
 *   - Make the CHECKS pass.
 *
 * Run:  npx tsc --noEmit 02-in-instanceof.problem.ts
 */

type Circle = { radius: number };
type Square = { size: number };
type Shape = Circle | Square;

// TODO: discriminate with `in`.
function area(shape: Shape): number {
  return 0;
}

// TODO: use `instanceof TypeError`.
function wrap(err: unknown): string {
  return "unknown error";
}

import { expectTypeOf } from "@lib";

// CHECKS — should pass once you implement the functions above.
expectTypeOf<typeof area>().toBeCallableWith({ radius: 2 });
expectTypeOf<typeof area>().toBeCallableWith({ size: 3 });
expectTypeOf<typeof wrap>().toBeCallableWith(new TypeError("boom"));
