/**
 * SOLUTION — Fixed-length tuples, labels, and readonly vs mutable
 *
 * Three things to internalise:
 *
 *  1. A tuple `[A, B]` is an array whose `length` is the *literal* `2`, and
 *     whose element type at index 0 differs from index 1. The literal-length
 *     property is THE defining feature that distinguishes a tuple from `A[]`.
 *
 *  2. Labels (`[first: string, second: number]`) are purely documentary — they
 *     show up in IntelliSense and error messages, but they do NOT become
 *     runtime properties. `pair.first` is NOT valid; you still index with
 *     `pair[0]`.
 *
 *  3. Assignability between `readonly` and mutable tuples is asymmetric:
 *       mutable tuple  → assignable to readonly tuple      (✓ widening)
 *       readonly tuple → NOT assignable to mutable tuple   (would allow mutation)
 *     The same rule applies to arrays: `number[]` is assignable to
 *     `readonly number[]` but not vice-versa.
 */

import { describe, assert, expectTypeOf } from "@lib";
import type { IsTuple } from "@lib";

// explanation: an explicit tuple annotation prevents the array literal from
// widening to `(string | number)[]`. Labels are documentation for the reader
// and for error messages.
const pair: [first: string, second: number] = ["hello", 42];

// CHECKS — all pass.

expectTypeOf<typeof pair>().toEqualTypeOf<[string, number]>();
expectTypeOf<typeof pair["length"]>().toEqualTypeOf<2>();

// `IsTuple` from @lib: a tuple has a literal length; `number[]` does not.
expectTypeOf<IsTuple<typeof pair>>().toEqualTypeOf<true>();
expectTypeOf<IsTuple<string[]>>().toEqualTypeOf<false>();

// Mutable tuple → readonly tuple: allowed (widening).
type RT = readonly [string, number];
expectTypeOf<typeof pair>().toExtend<RT>();

// Readonly tuple → mutable tuple: FORBIDDEN (would allow mutation of a
// "readonly" source). Use `@ts-expect-error` to prove it errors.
const ro: RT = ["a", 1];
// @ts-expect-error  The type 'readonly [string, number]' is 'readonly' and cannot be assigned to the mutable type '[string, number]'.
const mt: [string, number] = ro;
void mt;

// Index access works; `.first` does NOT — labels are not properties.
// @ts-expect-error  Property 'first' does not exist on type '[first: string, second: number]'.
const _bad = pair.first;
void _bad;

// Tuples are still arrays — `.map` / `.forEach` exist:
expectTypeOf<typeof pair.map>().toBeFunction();

// Runtime sanity: length is literally 2, indexing works.
describe("tuple runtime behaviour", () => {
  assert(pair.length === 2, "pair.length === 2");
  assert(pair[0] === "hello", "pair[0] === 'hello'");
  assert(pair[1] === 42, "pair[1] === 42");
});
