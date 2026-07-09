/**
 * PROMPT — Guards must be honest (the soundness hole)
 *
 * TypeScript **trusts** a `x is T` predicate. It does NOT verify that your
 * runtime implementation actually matches `T`. A guard whose body returns the
 * wrong boolean compiles fine — and then silently produces a value of the
 * wrong type, with the compiler's blessing.
 *
 * This is the fundamental *unsoundness* of user-defined guards: they hand
 * trust back to you. Write them so the runtime and the type system agree, and
 * prefer to check EVERY property you claim in `T`.
 *
 * Your job:
 *   1. Read `lyingGuard` — it claims `x is number` but checks `typeof === "string"`.
 *      Uncomment the `@ts-expect-error` line to confirm TS does NOT catch the lie.
 *   2. Implement `isPoint` honestly: check `x` is an object with numeric `x`
 *      and `y` so that callers really do get a `{ x: number; y: number }`.
 *
 * Run:  npx tsc --noEmit 03-honest-guards.problem.ts
 */

interface Point {
  x: number;
  y: number;
}

// TODO: an HONEST guard — verify shape AND both numeric properties.
function isPoint(value: unknown): value is Point {
  return false; // ❓ replace with a real check
}

// A deliberately dishonest guard — kept here to demonstrate the hole.
function lyingGuard(x: unknown): x is number {
  return typeof x === "string"; // wrong predicate vs. body
}

import { expectTypeOf } from "@lib";

// CHECKS — the honest guard must accept Points and reject everything else.
declare const u: unknown;
if (isPoint(u)) {
  expectTypeOf<typeof u>().toEqualTypeOf<Point>();
}
