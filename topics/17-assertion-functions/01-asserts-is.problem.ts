/**
 * PROMPT — `asserts x is T`
 *
 * A function whose return type is `asserts x is T` does two things:
 *
 *   1. At runtime it THROWS if `x` is not actually a `T`.
 *   2. In the type system, after a call `assertFoo(x)`, the variable `x` is
 *      narrowed to `T` for the REST of the scope — no `if` needed.
 *
 * Compare with a predicate `x is T` (Topic 16): a predicate only narrows
 * inside the `if (isFoo(x)) { ... }` branch. An assertion narrows *unconditionally
 * after the call*, because the only way execution continues past it is if the
 * assertion held.
 *
 * Task:
 *   1. Implement `assertString` so its return type is `asserts value is string`
 *      and it throws when `value` is not a string.
 *   2. Implement `assertPoint` with return type `asserts value is Point`,
 *      checking the shape at runtime.
 *   3. Make the CHECKS compile (they currently fail).
 *
 * Rules:
 *   - Do NOT touch the CHECKS region.
 *   - Do NOT use `any`.
 *
 * Run:  npx tsc --noEmit 01-asserts-is.problem.ts
 */

interface Point {
  x: number;
  y: number;
}

// TODO: replace `never` with the real assertion signature + body.
function assertString(value: unknown): never {
  throw new Error("not implemented");
}

function assertPoint(value: unknown): never {
  throw new Error("not implemented");
}

import { expectTypeOf } from "@lib";

// CHECKS — the narrowing induced after each assert call.

function _demoAssertString(v: unknown) {
  assertString(v);
  // After the call, `v` is `string`, not `unknown`:
  expectTypeOf<typeof v>().toEqualTypeOf<string>();
}
void _demoAssertString;

function _demoAssertPoint(v: unknown) {
  assertPoint(v);
  expectTypeOf<typeof v>().toEqualTypeOf<Point>();
  expectTypeOf<typeof v>().toExtend<{ x: number }>();
}
void _demoAssertPoint;

function _demoRejectsWrongTypeAfterAssert(v: unknown): number {
  assertString(v);
  // @ts-expect-error  v is narrowed to `string` here, which is not a `number`
  return v;
}
void _demoRejectsWrongTypeAfterAssert;
