/**
 * PROMPT — `Result<T, E> = Success<T> | Failure<E>`
 *
 * The canonical error-as-value type, lifted from Rust/Haskell into TS:
 *
 *   type Result<T, E> =
 *     | { ok: true;  value: T }
 *     | { ok: false; error: E };
 *
 * The `ok` literal discriminates the two arms. Because the tag is a literal,
 * `if (r.ok)` narrows to `Success` in the truthy branch and `Failure` in the
 * falsy branch — with no runtime field-shape checks.
 *
 * Task:
 *   1. Implement `map` — transform the success value, leave failure untouched.
 *   2. Implement `getOrElse` — return the value on success, a fallback on
 *      failure.
 *   3. Implement `ok` / `err` constructor helpers.
 *   4. Make the CHECKS compile.
 *
 * Rules:
 *   - Do NOT touch the CHECKS region.
 *   - Do NOT use `any`.
 *
 * Run:  npx tsc --noEmit 02-result.problem.ts
 */

// TODO: complete the Result union.
type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// TODO: transform the success value via `fn`; failures pass through unchanged.
function map<T, E, U>(r: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  return r; // wrong — replace with discriminant-based logic
}

// TODO: return the value on success, otherwise `fallback`.
function getOrElse<T, E>(r: Result<T, E>, fallback: T): T {
  return fallback; // wrong
}

// TODO: tiny constructors.
function ok<T>(value: T): Result<T, never> {
  return undefined as never;
}
function err<E>(error: E): Result<never, E> {
  return undefined as never;
}

import { expectTypeOf } from "@lib";

// CHECKS

function _demoMapTypes() {
  // explanation: build `r` through the `ok` constructor so inference resolves
  // `E` to `string` (raw single-arm literals confuse union inference here).
  const r: Result<number, string> = ok(3);
  const mapped = map(r, (n) => n.toString());
  // explanation: union subjects break expect-type's `toEqualTypeOf`/
  // `toExtend` constraint builders. The robust form is an annotated-const
  // assignment (compiles iff mapped is assignable to Result<string,string>).
  const _check: Result<string, string> = mapped;
  void _check;
}
void _demoMapTypes;

function _demoGetOrElse() {
  const okR: Result<number, string> = ok(3);
  const errR: Result<number, string> = err("bad");
  const fromOk = getOrElse(okR, 0);
  const fromErr = getOrElse(errR, 0);
  expectTypeOf<typeof fromOk>().toEqualTypeOf<number>();
  expectTypeOf<typeof fromErr>().toEqualTypeOf<number>();
}
void _demoGetOrElse;

function _demoConstructors() {
  const good = ok(1);
  const bad = err("x");
  const _good: Result<number, never> = good;
  const _bad: Result<never, string> = bad;
  void _good;
  void _bad;
}
void _demoConstructors;
