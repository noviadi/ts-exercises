/**
 * PROMPT — Tagged unions with a single discriminant
 *
 * A discriminated (a.k.a. tagged) union is a union of object types that each
 * carry a common property holding a *literal* value. Checking that one property
 * narrows to the matching member — no `in` or `typeof` gymnastics required.
 *
 *   type Shape =
 *     | { type: "circle";  radius: number }
 *     | { type: "square";  size:   number };
 *
 *   switch (s.type) {
 *     case "circle": return Math.PI * s.radius ** 2; // s: circle
 *     case "square": return s.size ** 2;             // s: square
 *   }
 *
 * Task:
 *   1. Fix the `Shape` union so each member carries a `type` discriminant
 *      (currently the tag is a plain `string`, which does NOT discriminate).
 *   2. Fix `area` to use the discriminant correctly.
 *   3. Make the CHECKS compile.
 *
 * Rules:
 *   - Do NOT touch the CHECKS region.
 *   - Do NOT use `any`.
 *
 * Run:  npx tsc --noEmit 01-shapes.problem.ts
 */

// TODO: this union does NOT discriminate — `type` is a plain string. Fix it.
type Shape = { type: string; radius: number } | { type: string; size: number };

// TODO: this should narrow via the discriminant. Currently it has type errors.
function area(s: Shape): number {
  if (s.type === "circle") {
    return Math.PI * s.radius ** 2;
  }
  return s.size ** 2;
}

import { expectTypeOf } from "@lib";

// CHECKS — the per-branch narrowing the discriminant gives us.

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
