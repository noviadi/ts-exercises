/**
 * PROMPT — Range of literal numbers & the recursion limit
 *
 * In `01` we built tuples by *spelling them out*. To do real type-level
 * counting we need a **recursive** helper that ticks up until a target length.
 *
 *   type BuildTo<N> = a tuple of length N, built by appending one element per
 *   recursive step until `Acc["length"]` hits `N`.
 *
 * From `BuildTo` we then build a `Range<From, To>` — a tuple of literal number
 * types `[From, From+1, ..., To-1]` (Python-style: inclusive of `From`,
 * exclusive of `To`).
 *
 * Your job: implement `BuildTo` and `Range`, then make the CHECKS compile.
 *
 * Rules:
 *   - Pure types only. Use an `Acc` (accumulator) default type parameter for the
 *     recursion.
 *   - Terminate the recursion by comparing `Acc["length"]` to the target — that
 *     is the BASE CASE that stops the conditional.
 *   - `Range` needs to (a) skip indices below `From`, (b) start collecting at
 *     `From`, and (c) stop at `To`. Use a `Collecting` flag to remember "we've
 *     started".
 *
 * Run:  npx tsc --noEmit 02-range-recursion-limit.problem.ts
 */

import { expectTypeOf } from "@lib";

// TODO: BuildTo<N> — tuple of length N. (Hint: keep it `readonly`.)
type BuildTo<N extends number, Acc extends readonly unknown[] = readonly []> =
  TODO;

// TODO: Range<From, To> — tuple of literal numbers [From .. To-1].
type Range<
  From extends number,
  To extends number,
  I extends readonly unknown[] = [],
  Collecting extends boolean = false,
> = TODO;

// CHECKS — make these compile.
expectTypeOf<BuildTo<0>>().toEqualTypeOf<readonly []>();
expectTypeOf<BuildTo<3>>().toEqualTypeOf<readonly [unknown, unknown, unknown]>();
expectTypeOf<BuildTo<3>["length"]>().toEqualTypeOf<3>();

expectTypeOf<Range<0, 0>>().toEqualTypeOf<[]>();
expectTypeOf<Range<0, 3>>().toEqualTypeOf<[0, 1, 2]>();
expectTypeOf<Range<2, 5>>().toEqualTypeOf<[2, 3, 4]>();
expectTypeOf<Range<5, 6>>().toEqualTypeOf<[5]>();
