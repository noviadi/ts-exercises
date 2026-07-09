/**
 * SOLUTION — `const` type parameters (`<const T>`)
 *
 * Placing `const` on a type parameter tells inference: "prefer the narrowest
 * literal/tuple form for this parameter, as if the caller had written
 * `as const`." This moves the opt-out of widening from every call site to the
 * (single) implementation signature.
 *
 * Where it shines:
 *   - rest-tuple helpers (`tuple`, `concat`) that should preserve element
 *     order and literal types;
 *   - "pick a literal" helpers used to build discriminated unions.
 *
 * Notes:
 *   - `<const T>` only changes *inference*; it adds no runtime behaviour.
 *   - Callers can still explicitly pass a wider type if they want widening.
 *   - Combine with `extends readonly unknown[]` for rest parameters so the
 *     inferred tuple is also assignable to readonly APIs.
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation: `const T` makes TS infer the literal tuple `["a","b","c"]` from
// the rest argument. The `extends readonly unknown[]` constraint lets us type
// the rest parameter `...xs: T` while still returning it as `T`.
function tuple<const T extends readonly unknown[]>(...xs: T): T {
  return xs;
}

// explanation: `const T` on a normal parameter makes TS infer the literal
// `"open"` instead of widening to `string`.
function pickLiteral<const T>(value: T): T {
  return value;
}

// CHECKS — inference is literal WITHOUT any `as const` at the call site.
expectTypeOf(tuple("a", "b", "c")).toEqualTypeOf<readonly ["a", "b", "c"]>();
expectTypeOf(pickLiteral("open")).toEqualTypeOf<"open">();
expectTypeOf(pickLiteral(42)).toEqualTypeOf<42>();

// Contrast: WITHOUT `const`, the same signatures would widen.
// (Shown as a compile-time contrast — these would be the *wrong* inference.)
expectTypeOf<["a", "b"]>().toExtend<readonly string[]>(); // tuples are arrays
expectTypeOf<"open">().toExtend<string>();                // literals are strings

describe("<const T> preserves values at runtime", () => {
  assert(JSON.stringify(tuple("a", "b", "c")) === '["a","b","c"]');
  assert(pickLiteral("open") === "open");
  assert(pickLiteral(42) === 42);
});
