/**
 * PROMPT — Sync generators & the iteration interfaces
 *
 * Below is a `range()` generator stubbed to return `any`. A real generator that
 * yields `number` should return `Generator<number>`, which TypeScript models as
 * something that is BOTH an `Iterable<number>` AND an `Iterator<number>`.
 *
 * Your job:
 *   1. Replace the `any` return type on `range` with the most precise type you
 *      can (start with `Generator<number>`).
 *   2. Make every assertion in the CHECKS region compile. Some already pass;
 *      others need `// @ts-expect-error <reason>` because the relationship is
 *      NOT what it first appears.
 *
 * Recall the three interfaces (from `lib.es2015.iterable`):
 *   - Iterable<T>          = { [Symbol.iterator](): Iterator<T> }
 *   - Iterator<T>          = { next(...args): IteratorResult<T, TReturn> }
 *   - IterableIterator<T>  = Iterator<T> & Iterable<T>
 *   - Generator<T,TReturn,TNext> extends IterableIterator<T>
 *
 * Run:  npx tsc --noEmit 01-sync-generator.problem.ts
 */

// TODO: give `range` a precise return type instead of `any`.
function* range(start: number, end: number): any {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

import { expectTypeOf } from "@lib";

// CHECKS — fix these so the file typechecks.

// `range` should yield numbers — what's its return type?
expectTypeOf<ReturnType<typeof range>>().toExtend<Iterable<number>>();
expectTypeOf<ReturnType<typeof range>>().toExtend<Iterator<number>>();
expectTypeOf<ReturnType<typeof range>>().toExtend<IterableIterator<number>>();

// A `Generator<number>` is NOT an `Iterator<string>` — annotate the error.
// expectTypeOf<ReturnType<typeof range>>().toExtend<Iterator<string>>();
