/**
 * SOLUTION — `asserts x` (the bare / truthy form) vs `asserts x is NonNullable<T>`
 *
 * Two flavours of "assert away a nullish branch":
 *
 *   - `asserts value is NonNullable<T>`  — removes BOTH `null` and `undefined`
 *     from `T`. This is the shape of Node's `assert(...)` and of the repo's own
 *     `@lib` `assert`.
 *   - `asserts value`                      (bare, no `is`) — narrows to the
 *     TRUTHY members of `T` only; it does NOT let you name a target type.
 *
 * And a third, custom one we build below: `assertNonNull`, which removes ONLY
 * `null` and leaves `undefined` alone — by writing our own conditional type and
 * using it as the assertion target.
 *
 * Mechanism reminder: `asserts value is X` narrows `value` to `X` for the rest
 * of the scope after the call — no `if`. (Contrast with Topic 16 predicates.)
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation: NonNullable<T> is a built-in that strips `null | undefined`.
// The body throws whenever `value` is one of those — the same check the type
// signature promises. This is the canonical `assertDefined`.
function assertDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(`expected non-null/undefined, got ${String(value)}`);
  }
}

// explanation: to remove ONLY `null` we name a custom target type. The
// conditional `T extends null ? never : T` is DISTRIBUTIVE over unions
// (Topic 07): for `string | null` it yields `string | never` = `string`,
// but for `string | undefined` it leaves `undefined` untouched. We then assert
// the value "is" that type — TS narrows accordingly.
type NonNull<T> = T extends null ? never : T;

function assertNonNull<T>(value: T): asserts value is NonNull<T> {
  if (value === null) {
    throw new Error("expected non-null");
  }
}

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

// explanation: assertNonNull leaves `undefined` alone — here the result is
// `string | undefined`, NOT `string`. This is the subtle difference between
// "remove null" and "remove null + undefined".
function _demoAssertNonNullKeepsUndefined(v: string | null | undefined) {
  assertNonNull(v);
  expectTypeOf<typeof v>().toEqualTypeOf<string | undefined>();
}
void _demoAssertNonNullKeepsUndefined;

// Contrast demo: a bare `asserts value` (no `is`) narrows to truthy members only.
function assertTruthy(value: unknown): asserts value {
  if (!value) throw new Error("expected truthy");
}

function _demoAssertTruthy(v: string | null | undefined | "") {
  assertTruthy(v);
  // Bare `asserts` removes ALL falsy members — null, undefined, AND "".
  expectTypeOf<typeof v>().toExtend<string>();
}
void _demoAssertTruthy;

// ---------------------------------------------------------------------------
// RUNTIME checks
// ---------------------------------------------------------------------------

describe("assertDefined narrows and throws on null/undefined", () => {
  let v: string | null | undefined = "ok";
  assertDefined(v);
  assert(v.length === 2, "v is usable as string after assert");

  for (const bad of [null, undefined] as Array<string | null | undefined>) {
    let threw = false;
    try {
      assertDefined(bad);
    } catch {
      threw = true;
    }
    assert(threw, `rejects ${String(bad)}`);
  }
});

describe("assertNonNull removes null but keeps undefined", () => {
  const present: string | null = "hi";
  assertNonNull(present);
  assert(present === "hi", "non-null value passes through");

  let threw = false;
  try {
    assertNonNull(null satisfies string | null);
  } catch {
    threw = true;
  }
  assert(threw, "rejects null");

  // undefined is allowed through — the assertion does not throw for it.
  const maybe: string | undefined | null = undefined;
  assertNonNull(maybe); // no throw
  assert(maybe === undefined, "undefined passed assertNonNull untouched");
});
