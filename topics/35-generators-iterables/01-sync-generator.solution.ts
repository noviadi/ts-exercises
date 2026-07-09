/**
 * SOLUTION — Sync generators & the iteration interfaces
 *
 * A `function*` declaration produces a **generator object** when called. That
 * object's type is `Generator<T, TReturn, TNext>`, where:
 *
 *   - `T`       — the type of values YIELDED (what `yield expr` produces to the
 *                 consumer).
 *   - `TReturn` — the type a consumer sees as the final `.value` when the
 *                 generator `return`s. Defaults to `void`/`any` for `function*`.
 *   - `TNext`   — the type that `yield` *evaluates to* inside the body (i.e. the
 *                 type the caller passes back in via `.next(v)`). Defaults to
 *                 `unknown`.
 *
 * The key insight is the interface hierarchy:
 *
 *     Generator<T, TReturn, TNext>
 *       extends IterableIterator<T>          // (Iterator<T> & Iterable<T>)
 *
 * So a generator is simultaneously:
 *   - an Iterable<T>  → usable in `for...of`, spread, destructuring;
 *   - an Iterator<T>  → has `.next()` returning `IteratorResult<T>`;
 *   - an IterableIterator<T> → both of the above.
 */

import { assert, describe, assertEquals, expectTypeOf } from "@lib";

// explanation: the return type annotation `Generator<number>` pins down all
// three type parameters via their defaults: `Generator<number, void, unknown>`.
// We only need to name `T` (number); the other two are inferred sensibly.
function* range(start: number, end: number): Generator<number> {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

// CHECKS — compile-time proof of the interface relationships.

// A `Generator<number>` IS an `Iterable<number>`, an `Iterator<number>`, AND an
// `IterableIterator<number>` (it extends all three):
expectTypeOf<ReturnType<typeof range>>().toExtend<Iterable<number>>();
expectTypeOf<ReturnType<typeof range>>().toExtend<Iterator<number>>();
expectTypeOf<ReturnType<typeof range>>().toExtend<IterableIterator<number>>();

// The relationship is NOT symmetric in `T`: `Generator<number>` is NOT an
// `Iterator<string>` because the yielded value type is fixed.
// @ts-expect-error  Generator<number> is not an Iterator<string> — T mismatches.
expectTypeOf<ReturnType<typeof range>>().toExtend<Iterator<string>>();

// explanation: `yield i;` makes `number` the `T` (yielded-value type). The
// *value of the expression* `yield i` itself is `unknown` (the default TNext)
// because the caller can pass any `.next(v)` value — here we ignore it, which
// is the common case. If we wanted typed two-way communication we'd write
// `Generator<number, void, string>` and `yield` would evaluate to `string`.

// RUNTIME — behaviour: the generator works in `for...of` AND as a manual iterator.
describe("range() yields the expected sequence", () => {
  const collected: number[] = [];
  for (const n of range(1, 4)) collected.push(n);
  assertEquals(collected, [1, 2, 3]);

  // The same object is ALSO a manual Iterator — call .next() directly:
  const it = range(10, 13);
  assertEquals(it.next(), { value: 10, done: false });
  assertEquals(it.next(), { value: 11, done: false });
  assertEquals(it.next(), { value: 12, done: false });
  // Once exhausted, `done` flips to true and `value` is undefined:
  const final = it.next();
  assert(final.done === true, "exhausted iterator should report done:true");
  assert(final.value === undefined, "default TReturn => final value undefined");
});

// 💡 Takeaways:
//   • Type a `function*` with `Generator<T>` (or `Generator<T, TReturn, TNext>`
//     when you need two-way communication). You almost never need the long form.
//   • A generator satisfies `Iterable<T>`, `Iterator<T>`, AND
//     `IterableIterator<T>` — that's why `for...of`, spread, and `.next()` all
//     work on the same object.
//   • `yield`'s value type is `T`; the *expression's* type is `TNext`.
