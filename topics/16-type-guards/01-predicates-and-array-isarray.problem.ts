/**
 * PROMPT — Type predicates (`x is T`) and `Array.isArray`
 *
 * A **type guard** tells TypeScript how to narrow a value after a runtime
 * check. The built-ins (`typeof`, `instanceof`, `in`, `Array.isArray`) cover
 * most cases; the `value is T` *predicate return type* lets you write your
 * own.
 *
 *   function isString(x: unknown): x is string {
 *     return typeof x === "string";
 *   }
 *   if (isString(v)) { /* v: string *\/ }
 *
 * Your job:
 *   1. Implement `isString` as a type predicate.
 *   2. Implement `firstString` so the CHECKS compile and the runtime asserts
 *      pass. It must use both your `isString` guard AND `Array.isArray`.
 *
 * Run:  npx tsc --noEmit 01-predicates-and-array-isarray.problem.ts
 */

// TODO: turn this into a `value is string` guard.
function isString(value: unknown): boolean {
  return typeof value === "string";
}

// TODO: return the first string in `xs`, recursing ONE level into sub-arrays
//       via Array.isArray. Use `isString` to narrow elements.
function firstString(xs: readonly unknown[]): unknown {
  return xs[0];
}

import { expectTypeOf } from "@lib";

// CHECKS
declare const u: unknown;
if (isString(u)) {
  expectTypeOf<typeof u>().toEqualTypeOf<string>();
}
