/**
 * SOLUTION — `as const` produces readonly tuples of literal types
 *
 * `as const` is the single most useful immutability tool for literals. Two
 * effects, applied recursively to the whole expression:
 *
 *   1. Arrays become `readonly` TUPLES (fixed length, exact positions).
 *   2. Every string/number/boolean becomes its literal type
 *      (`"a"` instead of `string`, `1` instead of `number`).
 *
 * Why it matters in practice: it lets you write a config object once and have
 * TS know the *exact* union of allowed values (`"info" | "warn" | "error"`)
 * without writing the union by hand. It is also the bridge to Topic 13
 * (variadic tuples) and Topic 14 (`const` type parameters).
 */

import { describe, assert, expectTypeOf } from "@lib";

// Without `as const`: the array widens to a mutable, variable-length array
// whose element type is the UNION of all positions. Length is `number`.
const widened = ["a", 1];
expectTypeOf<typeof widened>().toEqualTypeOf<(string | number)[]>();
expectTypeOf<typeof widened.length>().toEqualTypeOf<number>();

// With `as const`: a readonly, fixed-length tuple of literal types.
const narrowed = ["a", 1] as const;
expectTypeOf<typeof narrowed>().toEqualTypeOf<readonly ["a", 1]>();
expectTypeOf<typeof narrowed.length>().toEqualTypeOf<2>();

// Negative checks to nail the difference:
expectTypeOf<typeof narrowed>().not.toExtend<(string | number)[]>();
// @ts-expect-error  The type 'readonly ["a", 1]' is 'readonly' and cannot be assigned to the mutable type '(string | number)[]'.
const _no: (string | number)[] = narrowed;
void _no;

// Object literal with `as const`: every key is readonly, every value a literal,
// every nested array a readonly tuple.
const config = {
  level: "info",
  ports: [8080, 8081],
} as const;

// explanation: `config.ports` is a readonly TUPLE of literal numeric types —
// not `number[]`. Length is the literal `2`.
expectTypeOf<typeof config["ports"]>().toEqualTypeOf<readonly [8080, 8081]>();
expectTypeOf<typeof config["ports"]["length"]>().toEqualTypeOf<2>();

// explanation: `config.level` is the literal `"info"`, not `string`. That is
// what makes `as const` so valuable for building discriminated unions and
// exhaustiveness checks (Topic 18, Topic 19) without writing unions by hand.
expectTypeOf<typeof config["level"]>().toEqualTypeOf<"info">();

// Every key on `config` is now readonly — mutation is rejected at compile time.
// We wrap the demo in a never-called function so the @ts-expect-error is still
// verified by tsc, but the (type-only) readonly flag isn't confused with a
// runtime freeze — `as const` does NOT make the JS object immutable at runtime.
function _demoReadonly(): void {
  // @ts-expect-error  Cannot assign to 'level' because it is a read-only property.
  config.level = "warn";
}
void _demoReadonly;

// Runtime: `as const` does NOTHING at runtime — the values are unchanged.
// It is a purely type-level instruction (zero-cost).
describe("as const runtime behaviour", () => {
  assert(Array.isArray(narrowed), "narrowed is still an array at runtime");
  assert(narrowed[0] === "a" && narrowed[1] === 1, "values unchanged");
  assert(config.ports[0] === 8080, "config.ports[0] === 8080");
  assert(config.level === "info", "config.level === 'info'");
});
