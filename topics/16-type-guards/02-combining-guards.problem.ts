/**
 * PROMPT — Combining custom guards (AND / OR)
 *
 * Guards compose just like boolean checks:
 *
 *   - AND: chain `if`s to narrow to an intersection (A & B).
 *   - OR:  return a single predicate `x is A | B` whose body covers both.
 *
 * Your job:
 *   1. Implement `isNonNull` (guards out `null` AND `undefined`).
 *   2. Implement `isStringOrNumber` as a single `x is string | number`
 *      predicate.
 *   3. Use `isNonNull` together with `isString` in `process` so the CHECKS
 *      compile.
 *
 * Run:  npx tsc --noEmit 02-combining-guards.problem.ts
 */

// TODO: a guard that's true when x is neither null nor undefined.
//       Hint: the predicate type should narrow `null | undefined` OUT of T.
function isNonNull<T>(x: T): boolean {
  return x !== null && x !== undefined;
}

// TODO: a single union predicate `x is string | number`.
function isStringOrNumber(x: unknown): boolean {
  return typeof x === "string" || typeof x === "number";
}

// TODO: narrow `value` to a non-null string before returning its length.
function process(value: string | null | undefined): number | undefined {
  if (isString(value) && isNonNull(value)) {
    return value; // ❓ should be `string` here — return its length
  }
  return undefined;
}

// Helper from 01 (re-declared here so this file is self-contained).
function isString(x: unknown): x is string {
  return typeof x === "string";
}

import { expectTypeOf } from "@lib";

// CHECKS
declare const v: unknown;
if (isStringOrNumber(v)) {
  expectTypeOf<typeof v>().toEqualTypeOf<string | number>();
}
declare const n: string | null;
if (isNonNull(n)) {
  expectTypeOf<typeof n>().toEqualTypeOf<string>();
}
