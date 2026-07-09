/**
 * PROMPT — `void` vs `undefined` (and the lattice recap)
 *
 * `void` is NOT a value type — it is a CONTRACT. It means "the caller must
 * ignore the return value". A function annotated `: void` may happen to return
 * `undefined` (or even a real value at runtime), but the type system promises
 * callers nothing usable comes back.
 *
 * The famous consequence: **void-return covariance**. You can pass a function
 * that returns `number` where one returning `void` is expected (think
 * `Array.prototype.forEach` callbacks) — but NOT the reverse.
 *
 * Tasks:
 *   1. Implement `log` (returns `void`) and `maybeUndef` (returns `undefined`).
 *   2. Fix the CHECKS so they describe the real relationships.
 *
 * Run:  npx tsc --noEmit 03-void-vs-undefined.problem.ts
 */

let lastLogged: string | null = null;

// A void-returning side-effectful function. (No console.log spam — we record.)
function log(value: string): void {
  // TODO: set lastLogged and return implicitly (no explicit return value).
}

// Contrast: an `undefined`-returning function MUST actually produce undefined.
function maybeUndef(x: boolean): undefined {
  // TODO: return undefined (you cannot just `return;` here under strict).
  return undefined;
}

import { expectTypeOf } from "@lib";

// CHECKS — annotate the truth. Keep or @ts-expect-error each line.

// void and undefined are DISTINCT types:
expectTypeOf<void>().toEqualTypeOf<undefined>();

// A `() => undefined` IS assignable to a `() => void` (covariance):
expectTypeOf<() => undefined>().toExtend<() => void>();

// ❓ Is a `() => void` assignable to a `() => undefined`? Decide.
expectTypeOf<() => void>().toExtend<() => undefined>();
