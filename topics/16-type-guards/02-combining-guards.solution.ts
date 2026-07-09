/**
 * SOLUTION — Combining custom guards (AND / OR)
 *
 * Two composition patterns:
 *
 *   1. AND (intersection narrowing): chain `if (g1(x) && g2(x)) { ... }`.
 *      Each guard further narrows the same variable. This is how you build
 *      up "non-null AND string" from two small guards.
 *
 *   2. OR (union narrowing): declare ONE predicate `x is A | B` and make its
 *      body accept either. You cannot OR two predicates by `||` alone — the
 *      return TYPE must spell out the union you intend to narrow to.
 *
 * Pattern for "narrow `null | undefined` OUT of a generic T":
 *
 *   function isNonNull<T>(x: T): x is T & ({} | null) { ... }
 *
 * The idiomatic, readable form is `x is NonNullable<T>` — `NonNullable<T>`
 * is exactly `T` with `null | undefined` removed.
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation: `NonNullable<T>` is the built-in alias for "T minus null and
// undefined". Using it as the predicate type makes intent obvious.
function isNonNull<T>(x: T): x is NonNullable<T> {
  return x !== null && x !== undefined;
}

// explanation: a single union predicate. The body ORs the runtime checks; the
// return type spells out the union TS should narrow to.
function isStringOrNumber(x: unknown): x is string | number {
  return typeof x === "string" || typeof x === "number";
}

function isString(x: unknown): x is string {
  return typeof x === "string";
}

// AND composition: order doesn't matter — each guard narrows further.
function process(value: string | null | undefined): number | undefined {
  if (isNonNull(value) && isString(value)) {
    // After both guards, `value` is `string` (intersection of all narrowings).
    return value.length;
  }
  return undefined;
}

// CHECKS — wrapped in never-called functions so the `expectTypeOf` checks run
// purely in type-space (no runtime evaluation of the parameters).
function _orNarrowingDemo(v: unknown) {
  if (isStringOrNumber(v)) {
    // v narrowed: unknown → string | number
    expectTypeOf<typeof v>().toEqualTypeOf<string | number>();
  }
}
function _andNarrowingDemo(n: string | null) {
  if (isNonNull(n)) {
    // n narrowed: string | null → string
    expectTypeOf<typeof n>().toEqualTypeOf<string>();
  }
}
void _orNarrowingDemo;
void _andNarrowingDemo;

describe("combined guards behave at runtime", () => {
  assert(process("abc") === 3, "non-null string returns its length");
  assert(process(null) === undefined, "null → undefined");
  assert(process(undefined) === undefined, "undefined → undefined");
  assert(isNonNull("x") && !isNonNull(null) && !isNonNull(undefined));
  assert(isStringOrNumber("a") && isStringOrNumber(1) && !isStringOrNumber(true));
});
