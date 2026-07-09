/**
 * SOLUTION — Async iteration (AsyncIterable / AsyncIterator)
 *
 * `async function*` returns an `AsyncGenerator<T>` which, like its sync
 * cousin, is simultaneously an `AsyncIterable<T>` and an `AsyncIterator<T>`.
 * The differences from sync:
 *
 *   - `.next()` returns a `Promise<IteratorResult<T>>` (each step is async).
 *   - It is consumed with `for await (const x of source)` — NOT plain `for...of`.
 *   - The brand is `[Symbol.asyncIterator]`, not `[Symbol.iterator]`.
 *
 * Interface hierarchy:
 *     AsyncGenerator<T, TReturn, TNext>
 *       extends AsyncIterableIterator<T>     // AsyncIterator<T> & AsyncIterable<T>
 *
 * Use cases: paginated APIs, streaming lines from a socket, reading chunks
 * from a `ReadableStream`, etc. — anything where each value arrives later.
 */

import { assert, describe, assertEquals, expectTypeOf } from "@lib";

// explanation: `AsyncGenerator<number>` is the natural type — it pins the
// yielded value to `number` and lets TReturn/TNext default.
async function* asyncRange(start: number, end: number): AsyncGenerator<number> {
  for (let i = start; i < end; i++) {
    // In a real codebase you might `await fetch(...)` between yields; the
    // `await` is what makes the surrounding function* async-friendly.
    yield i;
  }
}

// CHECKS — an async generator extends all three async iteration interfaces.
expectTypeOf<ReturnType<typeof asyncRange>>().toExtend<AsyncIterable<number>>();
expectTypeOf<ReturnType<typeof asyncRange>>().toExtend<AsyncIterator<number>>();
expectTypeOf<
  ReturnType<typeof asyncRange>
>().toExtend<AsyncIterableIterator<number>>();

// And it is NOT a *sync* iterable — `[Symbol.iterator]` is absent:
// @ts-expect-error  An async generator is not a sync Iterable<T>.
expectTypeOf<ReturnType<typeof asyncRange>>().toExtend<Iterable<number>>();

// RUNTIME — consume with `for await...of`. We wrap in an async IIFE so the
// top-level file stays a plain ES module (top-level await would also work, but
// the IIFE makes the async boundary explicit for the kata).
describe("asyncRange() yields the expected sequence via for-await-of", async () => {
  const collected: number[] = [];
  // `for await` is the idiomatic way to drain an async iterable.
  for await (const n of asyncRange(1, 4)) {
    collected.push(n);
  }
  assertEquals(collected, [1, 2, 3]);

  // Manual `.next()` returns a Promise each time:
  const it = asyncRange(10, 12);
  assertEquals(await it.next(), { value: 10, done: false });
  assertEquals(await it.next(), { value: 11, done: false });
  const final = await it.next();
  assert(final.done === true, "async generator should finish with done:true");
});

// 💡 Takeaways:
//   • `async function*` → `AsyncGenerator<T>` (extends `AsyncIterableIterator<T>`).
//   • Each `.next()` is a Promise; consume with `for await...of`.
//   • Async iterables are NOT sync iterables — they use a different symbol.
//   • Typing a custom async source: implement `[Symbol.asyncIterator]()` and
//     return an object with an async `next()`.
