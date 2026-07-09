/**
 * PROMPT — Fixed-length tuples, labels, and readonly vs mutable
 *
 * Below is a `pair` value whose type the learner must write as a *labeled
 * tuple*. Then there are several `expectTypeOf` checks about (a) the tuple's
 * length being a literal, (b) labels not turning into runtime properties, and
 * (c) the assignability rules between `readonly` tuples and mutable arrays.
 *
 * Your job:
 *   1. Give `pair` a labeled tuple type `[first: string, second: number]`.
 *   2. Predict each CHECK — fix assertions that are wrong, adding
 *      `// @ts-expect-error <reason>` only above lines that genuinely error.
 *
 * Run:  npx tsc --noEmit 01-fixed-length-and-labels.problem.ts
 */

// TODO: type this as a LABELED tuple: [first: string, second: number]
const pair = ["hello", 42];

import { expectTypeOf } from "@lib";
import type { IsTuple } from "@lib";

// CHECKS — predict and fix these.

expectTypeOf<typeof pair>().toEqualTypeOf<[string, number]>();
expectTypeOf<typeof pair["length"]>().toEqualTypeOf<2>();

// Is a mutable tuple assignable to a readonly tuple?
type RT = readonly [string, number];
expectTypeOf<typeof pair>().toExtend<RT>();

// Is a readonly tuple assignable to a mutable tuple?
const ro: RT = ["a", 1];
const mt: [string, number] = ro;

// Tuples are still arrays — `.map` / `.forEach` exist:
expectTypeOf<typeof pair.map>().toBeFunction();
