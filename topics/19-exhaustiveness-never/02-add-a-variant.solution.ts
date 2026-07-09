/**
 * SOLUTION — The compile-time guarantee when you add a variant
 *
 * The `assertNever` pattern is a *compile-time* tripwire. When you extend a
 * discriminated union with a new variant and forget to handle it, the leftover
 * type in the `default` arm is no longer `never` — it is the new variant — so
 * the call `assertNever(s)` becomes a TYPE ERROR that points you straight at the
 * unhandled case.
 *
 * We model the scenario with two unions and two functions:
 *
 *   - `Shape`      / `describeComplete`   — all variants handled → `assertNever`
 *     sees `never` and compiles.
 *   - `ShapeBig`   / `describeForgotten`  — a "hexagon" variant was added but
 *     NOT handled → `assertNever(s)` is a compile error, which we acknowledge
 *     with a `// @ts-expect-error` directly above it.
 *
 * In a real codebase you would FIX the gap by adding the missing case. We leave
 * it broken here (annotated) so the file demonstrates the guarantee directly.
 */

import { assert, describe, expectTypeOf } from "@lib";

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

// explanation: `describeForgotten` is missing the "hexagon" case. In the
// default arm, `s` is narrowed to `{ type: "hexagon"; side: number }` — NOT
// `never` — so passing it to a parameter typed `never` is an error. We tag the
// error with @ts-expect-error so the file typechecks while still documenting
// the exact gap the pattern would normally force you to fix.
function describeForgotten(s: ShapeBig): string {
  switch (s.type) {
    case "circle":
      return `circle r=${s.radius}`;
    case "square":
      return `square s=${s.size}`;
    default:
      // @ts-expect-error  hexagon not handled → s is not `never` here
      return assertNever(s);
  }
}
// (We "use" describeForgotten only at the type level; never call it at runtime.)
void describeForgotten;

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

// ---------------------------------------------------------------------------
// RUNTIME checks — exercise the COMPLETE function (the broken one is type-only).
// ---------------------------------------------------------------------------

describe("describeComplete handles every variant", () => {
  assert(describeComplete({ type: "circle", radius: 2 }) === "circle r=2");
  assert(describeComplete({ type: "square", size: 3 }) === "square s=3");
});

describe("assertNever catches the logically-impossible path at runtime", () => {
  let threw = false;
  try {
    assertNever({ type: "hexagon" } as unknown as never);
  } catch {
    threw = true;
  }
  assert(threw, "runtime safety net throws");
});
