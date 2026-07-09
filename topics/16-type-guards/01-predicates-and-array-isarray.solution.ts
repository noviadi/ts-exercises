/**
 * SOLUTION — Type predicates (`x is T`) and `Array.isArray`
 *
 * A **type predicate** `value is T` is a *return type* that says: "when this
 * function returns `true`, treat the argument as `T` in the caller's branch."
 *
 * Built-in guards you already use:
 *   - `typeof x === "string"`  — narrows inline to `string`
 *   - `x instanceof Date`      — narrows to the class
 *   - `"k" in x`               — narrows to "has property k"
 *   - `Array.isArray(x)`      — narrows to `any[]` (NOT `T[]`; element is `any`)
 *
 * Custom `is T` predicates let you encapsulate more complex checks and reuse
 * them — but note the trust model: TS does not verify your implementation, so
 * the predicate must match reality (Topic 16/03 dives into this).
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation: the predicate `value is string` is what makes the narrowing
// happen in callers. The body just needs to return a boolean that's true iff
// `value` really is a string.
function isString(value: unknown): value is string {
  return typeof value === "string";
}

// explanation: Array.isArray narrows `unknown` to `any[]`. Under
// `noUncheckedIndexedAccess`, indexing it yields `unknown` (not `any`), so we
// still must guard each element before using it.
function firstString(xs: readonly unknown[]): string | undefined {
  for (const x of xs) {
    if (isString(x)) return x; // x narrowed: unknown → string
    if (Array.isArray(x)) {
      const head = x[0]; // head: unknown (noUncheckedIndexedAccess)
      if (head !== undefined && isString(head)) return head;
    }
  }
  return undefined;
}

// CHECKS — the predicate's effect on the static type.
// explanation: the narrowing demo lives inside a never-called function so the
// `expectTypeOf` (a compile-time check) runs in type-space without evaluating
// `u` at runtime.
function _narrowingDemo(u: unknown) {
  if (isString(u)) {
    // Inside this block TS treats `u` as `string` — `typeof u` reflects it.
    expectTypeOf<typeof u>().toEqualTypeOf<string>();
  }
}
void _narrowingDemo;

describe("guards narrow correctly at runtime", () => {
  assert(firstString([1, 2, "hit"]) === "hit", "top-level string found");
  assert(firstString([1, 2, ["deep", 3]]) === "deep", "nests one level");
  assert(firstString([42, true]) === undefined, "no string → undefined");
  assert(isString("x") && !isString(3), "isString tells the truth");
});
