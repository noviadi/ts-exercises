/**
 * SOLUTION — `in` and `instanceof` narrowing
 *
 *  `in`  — When you write `"k" in obj`, TypeScript narrows `obj` in each
 *          branch: inside the `true` branch, `obj` is the member(s) of the
 *          union that HAVE a `k` property; inside the `false` branch, it's the
 *          member(s) that DON'T. This lets you discriminate `Circle` (has
 *          `radius`) from `Square` (has `size`) with no shared tag field.
 *
 *  `instanceof` — Narrows to the right-hand constructor's prototype, so inside
 *          `if (err instanceof TypeError)` the value has all of `Error`'s and
 *          `TypeError`'s own properties (e.g. `.message`). Note: `instanceof`
 *          requires a real constructor function/class at runtime; it cannot be
 *          used to narrow a plain `type` alias with no runtime presence.
 *
 * Both operators are *type guards* that TS understands natively — no custom
 * `x is T` predicate is needed (that's Topic 16).
 */

type Circle = { radius: number };
type Square = { size: number };
type Shape = Circle | Square;

// explanation: `"radius" in shape` narrows `shape` to `Circle` in the true
// branch (because only `Circle` has a `radius` property) and to `Square` in
// the `else` (the only member left). That's why reading `.radius` / `.size` is
// safe with no cast.
function area(shape: Shape): number {
  if ("radius" in shape) {
    // shape: Circle — Math.PI * radius^2
    expectTypeOf<typeof shape>().toEqualTypeOf<Circle>();
    return Math.PI * shape.radius * shape.radius;
  }
  // shape: Square — narrowed by exclusion of the Circle branch.
  expectTypeOf<typeof shape>().toEqualTypeOf<Square>();
  return shape.size * shape.size;
}

// explanation: `instanceof TypeError` narrows `unknown` to `TypeError`, which
// transitively carries `Error`'s `.message` property. In the `else` branch we
// still know nothing, so we keep a safe fallback.
function wrap(err: unknown): string {
  if (err instanceof TypeError) {
    expectTypeOf<typeof err>().toEqualTypeOf<TypeError>();
    return err.message;
  }
  return "unknown error";
}

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — both call signatures accept the shapes they should.
expectTypeOf<typeof area>().toBeCallableWith({ radius: 2 });
expectTypeOf<typeof area>().toBeCallableWith({ size: 3 });
expectTypeOf<typeof wrap>().toBeCallableWith(new TypeError("boom"));
// A bare Error (not TypeError) is still accepted because wrap takes `unknown`.
expectTypeOf<typeof wrap>().toBeCallableWith(new Error("generic"));

// Runtime checks prove the discrimination actually works.
describe("in / instanceof narrow correctly", () => {
  assert(area({ radius: 2 }) === Math.PI * 4, "Circle branch computed π r²");
  assert(area({ size: 3 }) === 9, "Square branch computed size²");

  assert(wrap(new TypeError("boom")) === "boom", "instanceof surfaced the message");
  assert(wrap("just a string") === "unknown error", "non-TypeError fell through");
});
