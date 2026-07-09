/**
 * PROMPT — `asserts x` (the bare / truthy form)
 *
 * The bare assertion signature `asserts x` (no `is T`) tells the type system:
 * "if this function returns normally, then `x` is truthy." That narrows away
 * `null`, `undefined`, `false`, `0`, `""` — whatever the falsy members of `x`'s
 * type were.
 *
 * The two most common real-world uses:
 *
 *   - `asserts x is NonNullable<T>`  — narrows `T | null | undefined` → `T`.
 *     (This is the EXACT shape of Node's `assert(...)`.)
 *   - `asserts x`                     — narrows to truthy members only.
 *
 * Task:
 *   1. Implement `assertDefined` with signature
 *      `asserts value: NonNullable<T>` style — i.e. it should narrow
 *      `T | null | undefined` to `T` after the call. Use the
 *      `asserts value is NonNullable<T>` form.
 *   2. Implement `assertNonNull` (a variant that only removes `null`, keeping
 *      `undefined`) and reason about how its narrowing differs.
 *
 * Rules:
 *   - Do NOT touch the CHECKS region.
 *   - Do NOT use `any`.
 *
 * Run:  npx tsc --noEmit 02-asserts-truthy.problem.ts
 */

// TODO: signature + body for assertDefined.
//   It must narrow `T | null | undefined` to `T` (i.e. remove both null & undef).
function assertDefined<T>(value: T): void {
  throw new Error("not implemented");
}

// TODO: signature + body for assertNonNull.
//   It must narrow `T | null` to `T` (remove `null` ONLY, keep `undefined`).
//   Hint: use a conditional or a second type param to describe "T without null".
function assertNonNull<T>(value: T): void {
  throw new Error("not implemented");
}

import { expectTypeOf } from "@lib";

// CHECKS

function _demoAssertDefined(v: string | null | undefined) {
  assertDefined(v);
  expectTypeOf<typeof v>().toEqualTypeOf<string>();
}
void _demoAssertDefined;

function _demoAssertDefinedOnNumber(v: number | undefined) {
  assertDefined(v);
  expectTypeOf<typeof v>().toEqualTypeOf<number>();
}
void _demoAssertDefinedOnNumber;

function _demoAssertNonNull(v: string | null) {
  assertNonNull(v);
  expectTypeOf<typeof v>().toEqualTypeOf<string>();
}
void _demoAssertNonNull;
