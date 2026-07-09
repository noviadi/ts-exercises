/**
 * SOLUTION — Guards must be honest (the soundness hole)
 *
 * TypeScript does not — and cannot — prove that your predicate's BODY matches
 * its declared `x is T`. The relationship between the runtime check and the
 * declared type is a contract you, the author, must uphold.
 *
 * A lying guard compiles. Example:
 *
 *   function lyingGuard(x: unknown): x is number {
 *     return typeof x === "string"; // declares `number`, checks `string`
 *   }
 *
 * Callers will believe they have a `number` and crash at runtime. The compiler
 * will not save you. Two practical disciplines:
 *
 *   1. Check EVERY property you mention in `T`. Don't claim `is Point` if you
 *      only checked `typeof x === "object"`.
 *   2. For public API boundaries, prefer a schema/decoder library (Zod,
 *      `@effect/schema`, `valibot`) that *generates* a trustworthy guard from
 *      a declarative schema.
 */

import { assert, describe, expectTypeOf } from "@lib";

interface Point {
  x: number;
  y: number;
}

// explanation: every claim in `Point` is checked at runtime — it's an object,
// has `x` and `y`, and both are numbers. If you add a field to `Point`, you
// must add a check here too, or the guard becomes stale (a real maintenance
// hazard — TS won't remind you).
function isPoint(value: unknown): value is Point {
  if (typeof value !== "object" || value === null) return false;
  // explanation: `noPropertyAccessFromIndexSignature` forces bracket access
  // when the type is an index-signature (`Record<...>`). Use ["x"], not .x.
  const p = value as Record<string, unknown>;
  return typeof p["x"] === "number" && typeof p["y"] === "number";
}

// The dishonest guard — kept as a teaching example. It compiles, but it lies.
// We do NOT call it; we only demonstrate that the compiler accepts the lie.
function lyingGuard(x: unknown): x is number {
  return typeof x === "string";
}

// CHECKS — wrapped in never-called functions so the compile-time `expectTypeOf`
// checks don't evaluate the parameters at runtime.
function _honestNarrowingDemo(u: unknown) {
  if (isPoint(u)) {
    expectTypeOf<typeof u>().toEqualTypeOf<Point>();
  }
}
void _honestNarrowingDemo;

// Demonstration of the unsoundness: a lying guard compiles, then mis-narrows.
// (No `@ts-expect-error` here — that's exactly the point: there is NO error.)
function _lyingNarrowingDemo(maybe: unknown) {
  if (lyingGuard(maybe)) {
    // TS believes `maybe: number`, but at runtime `maybe` could be a string.
    expectTypeOf<typeof maybe>().toEqualTypeOf<number>();
  }
}
void _lyingNarrowingDemo;

describe("honest guards behave; dishonest ones compile anyway", () => {
  assert(isPoint({ x: 1, y: 2 }) === true, "real Point accepted");
  assert(isPoint({ x: 1 }) === false, "missing field rejected");
  assert(isPoint({ x: "a", y: 2 }) === false, "wrong field type rejected");
  assert(isPoint(null) === false, "null rejected");
  // The lying guard returns true for strings even though it claims `number`:
  assert(lyingGuard("oops") === true, "lying guard returns true for a string");
});

describe("calling a dishonest guard produces wrong runtime values", () => {
  const input: unknown = "oops";
  if (lyingGuard(input)) {
    // `input` is typed as `number` here, but runtime value is "oops".
    assert(typeof input === "string", "runtime is still string");
  }
});
