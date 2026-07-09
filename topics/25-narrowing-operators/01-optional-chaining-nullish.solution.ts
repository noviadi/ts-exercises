/**
 * SOLUTION — Optional chaining, nullish coalescing, truthiness
 *
 * Each operator narrows types as a side-effect of how it evaluates at runtime.
 *
 *  `?.`  — Optional chaining. If the left side is `null`/`undefined`, the whole
 *          expression short-circuits to `undefined`. So `m.value?.toUpperCase()`
 *          has type `string | undefined`: `string` when the chain completes,
 *          `undefined` when it short-circuited (or when `m.value` was itself
 *          absent). Note the `null` possibility was absorbed — `?.` treats
 *          `null` and `undefined` identically.
 *
 *  `??`  — Nullish coalescing. Returns the right side ONLY when the left is
 *          `null` or `undefined`. Crucially it does NOT trigger on `0`, `""`,
 *          or `false` (unlike `||`). So `num ?? 42` has type `number`:
 *          either `num` was a real number, or we substituted `42` — both are
 *          `number`. The `null`/`undefined` arms are gone.
 *
 *  `if (str)` — Truthiness narrowing. Inside the block TS strips EVERY falsy
 *          member of the union: `null`, `undefined`, AND `""`. So
 *          `string | "" | null | undefined` collapses to `string` (the `""`
 *          literal is removed because it's falsy). The leftover branch
 *          (`else`, or after the `if`) keeps the falsy members.
 */

type Maybe = { value?: string | null };

// Real (runtime) values with the union types we want to demonstrate narrowing
// on. Annotated explicitly so the *declared* type is the wide union, even
// though each happens to hold a present value.
const m: Maybe = { value: "hi" };
const num: number | null | undefined = 7;
const str: string | "" | null | undefined = "non-empty";

const v = m.value?.toUpperCase();
const fallback = num ?? 42;

// explanation: `m.value` is `string | null | undefined` (the optional `?` adds
// `undefined`). `?.toUpperCase()` returns `string` on the happy path and
// short-circuits to `undefined` otherwise — `null` is absorbed into the
// short-circuit arm, so the result is `string | undefined`.
expectTypeOf<typeof v>().toEqualTypeOf<string | undefined>();

// explanation: `??` only falls back on null/undefined. `num` is
// `number | null | undefined`; after `?? 42` the null/undefined arms are
// replaced by `42`, so the type collapses to plain `number`.
expectTypeOf<typeof fallback>().toEqualTypeOf<number>();

if (str) {
  // explanation: truthiness narrows. The `""` literal is falsy, so it's
  // stripped alongside `null` and `undefined`. What remains is the
  // non-empty `string`. (Compare: `??` would have LEFT `""` in, because an
  // empty string is not nullish.)
  expectTypeOf<typeof str>().toEqualTypeOf<string>();
}

import { assert, describe, expectTypeOf } from "@lib";

// Runtime demonstrations: the type-level story above, made executable.
describe("narrowing operators behave as typed", () => {
  // `?.` short-circuits to undefined when the chain hits null/undefined.
  const empty: Maybe = { value: null };
  assert(empty.value?.toUpperCase() === undefined, "?. short-circuits on null");

  // `??` preserves 0 / "" / false; `||` does not.
  const zero: number | null = 0;
  assert((zero ?? 42) === 0, "?? keeps 0 because 0 is not nullish");
  assert((zero || 42) === 42, "|| discards 0 because 0 is falsy");

  // truthiness: an empty string is falsy, so the else-branch keeps it.
  const maybeEmpty: string | "" = "";
  if (maybeEmpty) {
    throw new Error("unreachable: empty string is falsy");
  } else {
    assert(maybeEmpty === "", "truthiness narrowing put '' in the else branch");
  }
});
