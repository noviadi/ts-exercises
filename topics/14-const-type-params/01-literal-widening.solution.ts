/**
 * SOLUTION — `as const` and literal widening
 *
 * "Widening" is TypeScript generalising a literal to its base type. It happens
 * wherever a value is *mutable* — because the compiler must assume the slot
 * could later hold a different value of the same base type.
 *
 *   `const` binding       → no widening (binding can't be reassigned)
 *   `let` binding         → widened
 *   object property       → widened (mutable by default)
 *   array element         → widened (arrays are mutable containers)
 *
 * `as const` is the opt-out switch: it freezes every literal to its narrowest
 * form AND marks every property/element `readonly`. It is a *compile-time*
 * annotation — it emits no runtime code.
 */

import { assert, describe, expectTypeOf } from "@lib";

const a = "hello";
let b = "hello";
const obj = { kind: "circle" };
// explanation: adding `as const` makes `kind` the literal `"circle"` (and the
// property becomes `readonly`). Without it, `obj.kind` would be `string`.
const objFrozen = { kind: "circle" } as const;
const arr = ["a", "b"];
// explanation: `as const` on an array literal turns `string[]` into a readonly
// tuple `readonly ["a", "b"]` — fixed length, fixed order, literal elements.
const arrFrozen = ["a", "b"] as const;

// CHECKS — these all pass; read them as documentation of the widening rules.

// Immutable `const` binding → literal type preserved (no widening).
expectTypeOf<typeof a>().toEqualTypeOf<"hello">();

// Reassignable `let` binding → widened to `string`.
expectTypeOf<typeof b>().toEqualTypeOf<string>();

// Plain object literal → property widened to `string`.
expectTypeOf<typeof obj.kind>().toEqualTypeOf<string>();
// `as const` → literal preserved.
expectTypeOf<typeof objFrozen.kind>().toEqualTypeOf<"circle">();

// Plain array literal → mutable `string[]`.
expectTypeOf<typeof arr>().toEqualTypeOf<string[]>();
// `as const` → readonly tuple of literals.
expectTypeOf<typeof arrFrozen>().toEqualTypeOf<readonly ["a", "b"]>();

// Runtime sanity: `as const` is purely a type-level annotation.
describe("as const emits no runtime code", () => {
  assert(objFrozen.kind === "circle", "kind is still 'circle' at runtime");
  assert(arrFrozen[0] === "a", "first tuple element is 'a'");
  assert(arrFrozen.length === 2, "tuple length is 2");
});
