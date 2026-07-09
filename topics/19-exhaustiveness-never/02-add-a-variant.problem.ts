/**
 * PROMPT — The compile-time guarantee when you add a variant
 *
 * Here is the payoff of the `assertNever` pattern. Suppose `Shape` grows a new
 * variant (`hexagon`). If you forget to add the matching `case` in `describe`,
 * the `default` arm's leftover type is no longer `never` — it is the new
 * variant — so `assertNever(s)` becomes a COMPILE ERROR, pointing you straight
 * at the unhandled case.
 *
 * We model this with TWO separate unions and TWO functions:
 *
 *   - `Shape` / `describeComplete`   — all variants handled (compiles).
 *   - `ShapeBig` / `describeForgotten` — a variant was added but NOT handled.
 *     Mark the bad line with `// @ts-expect-error` so the file still typechecks.
 *
 * Task:
 *   1. In `describeForgotten`, put `// @ts-expect-error <reason>` directly
 *      above the `return assertNever(s);` line so the documented gap is
 *      acknowledged.
 *   2. Make the CHECKS compile.
 *
 * Rules:
 *   - Do NOT touch the CHECKS region.
 *   - Do NOT add a "hexagon" case to `describeForgotten` — the whole point is
 *     that the compiler CATCHES the missing case.
 *
 * Run:  npx tsc --noEmit 02-add-a-variant.problem.ts
 */

function assertNever(x: never): never {
  throw new Error(`unhandled variant: ${JSON.stringify(x)}`);
}

type Shape =
  | { type: "circle"; radius: number }
  | { type: "square"; size: number };

type ShapeBig =
  | { type: "circle"; radius: number }
  | { type: "square"; size: number }
  | { type: "hexagon"; side: number };

// Complete — every variant handled; `assertNever(s)` sees `never`.
function describeComplete(s: Shape): string {
  switch (s.type) {
    case "circle":
      return `circle r=${s.radius}`;
    case "square":
      return `square s=${s.size}`;
    default:
      return assertNever(s);
  }
}

// Forgotten — "hexagon" was added to the union but NOT handled. The leftover
// type in `default` is now `{ type: "hexagon"; side: number }`, so `assertNever`
// rejects it. Add the @ts-expect-error to acknowledge this gap.
function describeForgotten(s: ShapeBig): string {
  switch (s.type) {
    case "circle":
      return `circle r=${s.radius}`;
    case "square":
      return `square s=${s.size}`;
    default:
      return assertNever(s);
  }
}

import { expectTypeOf } from "@lib";

// CHECKS — the two leftovers have different types.

// In describeComplete, after both cases, s is narrowed to `never`:
function _leftoverIsNever(s: Shape): number {
  switch (s.type) {
    case "circle":
      return 1;
    case "square":
      return 2;
    default:
      expectTypeOf<typeof s>().toBeNever();
      return assertNever(s);
  }
}
void _leftoverIsNever;

// In describeForgotten, after the two cases, s is narrowed to the hexagon member
// — NOT `never`. This is exactly why `assertNever(s)` in describeForgotten is a
// compile error: hexagon is not assignable to `never`.
function _leftoverIsHexagon(s: ShapeBig): number {
  switch (s.type) {
    case "circle":
      return 1;
    case "square":
      return 2;
    default:
      expectTypeOf<typeof s>().toEqualTypeOf<{
        type: "hexagon";
        side: number;
      }>();
      return 0;
  }
}
void _leftoverIsHexagon;
