/**
 * PROMPT — `never` (the bottom type)
 *
 * `never` is the type of values that *cannot exist*. No value has type
 * `never`. It is the BOTTOM of the lattice: it is assignable to every type,
 * but NOTHING (except `never` itself) is assignable to it.
 *
 * Two canonical uses:
 *   1. The return type of functions that never return (throw forever / loop).
 *   2. Exhaustiveness checking — a `never` parameter can only receive a value
 *      if a union has been narrowed away completely.
 *
 * Tasks:
 *   1. Implement `fail(msg)` so its return type is `never` (it throws).
 *   2. Implement `assertNever(x: never)` — the exhaustiveness helper.
 *   3. Fix the CHECKS to reflect the bottom-type rules.
 *
 * Run:  npx tsc --noEmit 02-never-the-bottom.problem.ts
 */

// TODO: implement. It must `throw` and its (inferred) return type must be `never`.
function fail(msg: string): never {
  // TODO
  throw new Error("not implemented");
}

// The exhaustiveness helper. The `never` parameter is the whole point:
// after a switch handles every case, the remaining value is `never`.
function assertNever(x: never): never {
  // TODO
  throw new Error("not implemented");
}

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.radius * s.radius;
    case "square":
      return s.size * s.size;
    default:
      // TODO: `s` is now `never` (all cases handled). Use assertNever here.
      return 0;
  }
}

import { expectTypeOf } from "@lib";

// CHECKS — fix these to describe the bottom-type truth.

// `never` is assignable to every type (bottom):
expectTypeOf<never>().toExtend<string>();

// ❓ Is `string` assignable to `never`? (Keep or @ts-expect-error.)
expectTypeOf<string>().toExtend<never>();
