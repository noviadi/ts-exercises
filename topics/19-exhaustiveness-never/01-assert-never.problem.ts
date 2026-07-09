/**
 * PROMPT — `assertNever(x: never)` and switch exhaustiveness
 *
 * The pattern:
 *
 *   function assertNever(x: never): never {
 *     throw new Error(`unhandled: ${JSON.stringify(x)}`);
 *   }
 *
 *   function area(s: Shape): number {
 *     switch (s.type) {
 *       case "circle":   return Math.PI * s.radius ** 2;
 *       case "square":   return s.size ** 2;
 *       case "triangle": return (s.base * s.height) / 2;
 *       default:         return assertNever(s); // s is `never` here
 *     }
 *   }
 *
 * Why does `s` become `never` in the `default` arm? Because once you've matched
 * `"circle"`, `"square"`, and `"triangle"`, NO member of `Shape` is left — so
 * the remaining type is `never`. Passing it to a function that REQUIRES `never`
 * typechecks. If you ever add a new member to `Shape` and forget a case, then
 * in `default` the leftover type is that new member (NOT `never`), and
 * `assertNever(s)` becomes a compile error pointing you at the gap. (See 02.)
 *
 * Task:
 *   1. Implement `assertNever`.
 *   2. Make `describe` exhaustive by handling EVERY variant and routing the
 *      `default` arm through `assertNever`.
 *
 * Rules:
 *   - Do NOT touch the CHECKS region.
 *   - Do NOT use `any`.
 *
 * Run:  npx tsc --noEmit 01-assert-never.problem.ts
 */

type Shape =
  | { type: "circle"; radius: number }
  | { type: "square"; size: number }
  | { type: "triangle"; base: number; height: number };

// TODO: implement so it accepts ONLY `never` and returns `never`.
function assertNever(x: never): never {
  throw new Error("not implemented");
}

// TODO: handle ALL three variants; the default should `return assertNever(s)`.
function describeShape(s: Shape): string {
  switch (s.type) {
    case "circle":
      return `circle r=${s.radius}`;
    // (square and triangle are missing — add them)
    default:
      return assertNever(s);
  }
}

import { expectTypeOf } from "@lib";

// CHECKS

// In the default arm (after all cases handled) `s` narrows to `never`.
// (This demo is complete — it's the pattern your `describeShape` should follow.)
function _defaultIsNever(s: Shape): string {
  switch (s.type) {
    case "circle":
      return `r=${s.radius}`;
    case "square":
      return `s=${s.size}`;
    case "triangle":
      return `a=${(s.base * s.height) / 2}`;
    default:
      expectTypeOf<typeof s>().toBeNever();
      return assertNever(s);
  }
}
void _defaultIsNever;

// describeShape handles every variant and returns a string:
function _describeReturn() {
  const out = describeShape({ type: "circle", radius: 1 });
  expectTypeOf<typeof out>().toBeString();
}
void _describeReturn;
