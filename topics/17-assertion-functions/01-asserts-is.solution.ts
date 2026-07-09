/**
 * SOLUTION — `asserts x is T`
 *
 * A function whose return type is `asserts x is T` does two things:
 *
 *   1. At runtime it THROWS if `x` is not actually a `T`.
 *   2. In the type system, after a call `assertFoo(x)`, the variable `x` is
 *      narrowed to `T` for the REST of the scope — no `if` needed.
 *
 * This is the key contrast with a predicate (`x is T`, Topic 16):
 *
 *   - Predicate narrows ONLY inside `if (isFoo(x)) { /* x: T *\/ }`.
 *   - Assertion narrows UNCONDITIONALLY AFTER `assertFoo(x)` — because the only
 *     way control reaches the next statement is if the call did not throw.
 *
 * Like a user-defined predicate, the body is TRUSTED: TS does not verify that
 * your runtime check matches the declared `T`. So write honest checks.
 */

import { assert, describe, expectTypeOf } from "@lib";

interface Point {
  x: number;
  y: number;
}

// explanation: the return type `asserts value is string` is the magic — it tells
// TS "if this function returns normally, you may treat `value` as `string`".
// The body must throw when the assumption is false; otherwise the assertion is a
// lie and the type system will quietly agree with the lie (same hazard as a
// lying `is T` predicate — Topic 16/03).
function assertString(value: unknown): asserts value is string {
  if (typeof value !== "string") {
    throw new Error(`expected string, got ${typeof value}`);
  }
}

// explanation: for an object shape we check every property we claim in `Point`.
// `noPropertyAccessFromIndexSignature` forces bracket access once we widen with
// the `Record` cast; this is the same discipline as the honest guard in 16/03.
function assertPoint(value: unknown): asserts value is Point {
  if (typeof value !== "object" || value === null) {
    throw new Error("expected object");
  }
  const p = value as Record<string, unknown>;
  if (typeof p["x"] !== "number" || typeof p["y"] !== "number") {
    throw new Error("expected { x: number; y: number }");
  }
}

// CHECKS — read these as documentation of the narrowing the assertion induces.
// explanation: each demo is wrapped in a never-called function so the
// compile-time `expectTypeOf` checks run in type-space without evaluating the
// (possibly crash-inducing) runtime body under tsx.

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

// explanation: contrast with a predicate — narrowing only lives inside the
// truthy branch, not after the `if`. (Kept here as the pedagogical counterpart.)
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function _demoPredicateOnlyNarrowsInBranch(v: unknown) {
  if (isString(v)) {
    expectTypeOf<typeof v>().toEqualTypeOf<string>(); // narrowed here...
  }
  // ...but NOT here. `v` is back to `unknown`. (No assertion we can make.)
}
void _demoPredicateOnlyNarrowsInBranch;

// Mistake demo: a deliberately wrong `return` is caught by the narrowing.
function _demoRejectsWrongTypeAfterAssert(v: unknown): number {
  assertString(v);
  // @ts-expect-error  v is narrowed to `string` here, which is not a `number`
  return v;
}
void _demoRejectsWrongTypeAfterAssert;

// ---------------------------------------------------------------------------
// RUNTIME checks — exercise the actual throwing behaviour.
// ---------------------------------------------------------------------------

describe("assertString narrows and throws honestly", () => {
  let v: unknown = "hello";
  assertString(v);
  // Runtime really is a string now:
  assert(v.toUpperCase() === "HELLO", "string behaviour works after assert");

  let threw = false;
  try {
    assertString(42 as unknown);
  } catch {
    threw = true;
  }
  assert(threw, "assertString throws on a non-string");
});

describe("assertPoint checks every field", () => {
  let p: unknown = { x: 1, y: 2 };
  assertPoint(p);
  assert(p.x + p.y === 3, "Point fields usable after assert");

  const cases: Array<[unknown, string]> = [
    [null, "null"],
    [{ x: 1 }, "missing y"],
    [{ x: "a", y: 2 }, "wrong field type"],
  ];
  for (const [bad, label] of cases) {
    let threw = false;
    try {
      assertPoint(bad);
    } catch {
      threw = true;
    }
    assert(threw, `rejects ${label}`);
  }
});
