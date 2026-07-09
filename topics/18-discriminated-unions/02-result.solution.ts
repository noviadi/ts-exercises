/**
 * SOLUTION — `Result<T, E> = Success<T> | Failure<E>`
 *
 * `Result` is a discriminated union whose tag is the boolean literal `ok`.
 * Because the tag is a literal (`true` / `false`), `if (r.ok)` narrows to the
 * success arm in the truthy branch and the failure arm in the falsy branch —
 * zero runtime field probing needed.
 *
 * Two design choices to notice:
 *
 *   - The constructors `ok` / `err` return `Result<T, never>` and
 *     `Result<never, E>` respectively. `never` is the *bottom* type
 *     (Topic 02) — "this arm is impossible" — so a successful result has no
 *     possible error type, and a failure has no possible value type. This
 *     composes cleanly with unions (e.g. `Result<number, never> | Result<never,
 *     string>` collapses to `Result<number, string>`).
 *   - `map` keeps the SAME error type `E` and only changes the success type to
 *     `U`. Failures pass through untouched — no transformation, no recompute.
 */

import { assert, describe, assertEquals, expectTypeOf } from "@lib";

type Success<T> = { ok: true; value: T };
type Failure<E> = { ok: false; error: E };
type Result<T, E> = Success<T> | Failure<E>;

// explanation: the discriminant check is `r.ok`. In the truthy branch `r` is
// narrowed to Success<T>; in the falsy branch to Failure<E>. We rebuild a new
// Result literal preserving the correct tag.
function map<T, E, U>(r: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  if (r.ok) {
    return { ok: true, value: fn(r.value) };
  }
  return { ok: false, error: r.error };
}

// explanation: here we don't even need the value in the failure branch, but we
// still narrow with `r.ok` so the success branch can read `r.value` safely.
function getOrElse<T, E>(r: Result<T, E>, fallback: T): T {
  return r.ok ? r.value : fallback;
}

// explanation: constructors encode "this arm only". `never` makes the other
// arm structurally unreachable, which is exactly what we want to express.
function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}
function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// CHECKS

function _demoMapTypes() {
  // explanation: we build `r` through the `ok` constructor rather than a raw
  // object literal. Both are annotated `Result<number, string>`, but TS's
  // inference for a type param (`E`) that lives only in a non-matching union
  // constituent is fragile when the source is a single-arm literal; using the
  // constructor gives inference a clean union to decompose, so `E` resolves to
  // `string` instead of falling back to `unknown`.
  const r: Result<number, string> = ok(3);
  const mapped = map(r, (n) => n.toString());
  // explanation: union types (Success | Failure) break expect-type's
  // `toEqualTypeOf`/`toExtend` constraint builders, which compute a broken
  // intersection shape `{ ok: boolean; value: never; error: never }`. The
  // robust, version-agnostic way to assert "mapped is a Result<string,string>"
  // is a plain annotated-const assignment: it compiles iff mapped is
  // assignable to Result<string,string>.
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
  // Annotated-const assignment (see _demoMapTypes note on union subjects):
  const _good: Result<number, never> = good;
  const _bad: Result<never, string> = bad;
  void _good;
  void _bad;
}
void _demoConstructors;

// explanation: composing `ok` and `err` of compatible types yields a Result
// whose unused arm has been statically eliminated — so a `Result<number,
// never>` is assignable to `Result<number, string>` (the success arm is
// compatible, the failure arm `never` is compatible with anything).
function _demoNeverCompose(): Result<number, string> {
  return ok(42); // Result<number, never> assignable to Result<number, string>
}
void _demoNeverCompose;

// ---------------------------------------------------------------------------
// RUNTIME checks
// ---------------------------------------------------------------------------

describe("map transforms success, preserves failure", () => {
  const success: Result<number, string> = ok(10);
  assertEquals(map(success, (n) => n * 2), { ok: true, value: 20 });

  const failure: Result<number, string> = err("nope");
  assertEquals(map(failure, (n) => n * 2), { ok: false, error: "nope" });
});

describe("getOrElse returns value or fallback", () => {
  assert(getOrElse(ok(7), 0) === 7, "success returns value");
  const failure: Result<number, string> = err("bad");
  assert(getOrElse(failure, 0) === 0, "failure returns fallback");
});

describe("constructors tag correctly", () => {
  assert(ok(1).ok === true, "ok tags true");
  assert(err("x").ok === false, "err tags false");
});
