/**
 * SOLUTION — Tagged unions with a single discriminant
 *
 * For a union to "discriminate", every member must share a property whose type
 * in EACH member is a different *literal* (`"circle"` vs `"square"`, not
 * `string`). When you compare that property to a literal, TS can immediately
 * narrow to the matching member — because only one member can possibly have
 * that literal value for the tag.
 *
 * Why literals? If the tag were `string`, then `s.type === "circle"` could be
 * true for ANY member (both have `type: string`), so TS could not rule out
 * either arm — and member-only fields (`radius` / `size`) would be unsafe to
 * access. The literal tag is what makes the narrowing sound.
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation: each member's `type` is a distinct string literal. That single
// property is the discriminant. Adding a member = adding one more literal tag.
type Shape =
  | { type: "circle"; radius: number }
  | { type: "square"; size: number };

// explanation: comparing the discriminant narrows `s` to exactly one member per
// branch, so `radius` and `size` are accessible without any cast or `in` check.
function area(s: Shape): number {
  switch (s.type) {
    case "circle":
      // s: { type: "circle"; radius: number }
      return Math.PI * s.radius ** 2;
    case "square":
      // s: { type: "square"; size: number }
      return s.size ** 2;
  }
}

// explanation: building a Shape is also type-checked at the literal level.
const sample: Shape = { type: "circle", radius: 2 };

// CHECKS

function _demoCircle(c: Shape) {
  if (c.type === "circle") {
    expectTypeOf<typeof c>().toEqualTypeOf<{
      type: "circle";
      radius: number;
    }>();
  }
}
void _demoCircle;

function _demoSquare(s: Shape) {
  if (s.type === "square") {
    expectTypeOf<typeof s>().toEqualTypeOf<{
      type: "square";
      size: number;
    }>();
  }
}
void _demoSquare;

// explanation: contrast — the WRONG union (string tag) does NOT discriminate.
// Inside the branch, `c` is still the full union, so member-only fields are
// unreachable. We keep it as a `@ts-expect-error` teaching demo.
type BadShape = { type: string; radius: number } | { type: string; size: number };

function _demoBadShape(c: BadShape) {
  if (c.type === "circle") {
    // @ts-expect-error  string tag does not discriminate; `radius` is unreachable
    c.radius;
  }
}
void _demoBadShape;

// ---------------------------------------------------------------------------
// RUNTIME checks
// ---------------------------------------------------------------------------

describe("area narrows by the discriminant", () => {
  assert(area({ type: "circle", radius: 1 }) === Math.PI, "unit circle area");
  assert(area({ type: "square", size: 3 }) === 9, "3x3 square area");
  assert(area(sample) === Math.PI * 4, "sample circle area");
});
