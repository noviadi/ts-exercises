/**
 * PROMPT — Async iteration (AsyncIterable / AsyncIterator)
 *
 * An `async function*` produces an **async generator**: an object that is
 * `AsyncIterable<T>` and `AsyncIterator<T>`, consumable with `for await...of`.
 *
 * Your job:
 *   1. Replace `any` on `asyncRange` with `AsyncGenerator<number>`.
 *   2. Make every CHECK compile.
 *
 * Async interfaces (from `lib.es2018.asynciterable`):
 *   - AsyncIterable<T>          = { [Symbol.asyncIterator](): AsyncIterator<T> }
 *   - AsyncIterator<T>          = { next(...): Promise<IteratorResult<T>> }
 *   - AsyncIterableIterator<T>  = AsyncIterator<T> & AsyncIterable<T>
 *   - AsyncGenerator<T>         extends AsyncIterableIterator<T>
 *
 * Run:  npx tsc --noEmit 02-async-iteration.problem.ts
 */

// TODO: type the return type instead of `any`.
async function* asyncRange(start: number, end: number): any {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

import { expectTypeOf } from "@lib";

// CHECKS
expectTypeOf<ReturnType<typeof asyncRange>>().toExtend<AsyncIterable<number>>();
expectTypeOf<ReturnType<typeof asyncRange>>().toExtend<AsyncIterator<number>>();
expectTypeOf<ReturnType<typeof asyncRange>>().toExtend<
  AsyncIterableIterator<number>
>();
