/**
 * SOLUTION — ObjectFromEntries & TupleToObject
 *
 * ── ObjectFromEntries<T> ─────────────────────────────────────────────────────
 *
 * Input:  a tuple of pairs, e.g. (inferred from `as const`)
 *           readonly [ readonly ["id", 1], readonly ["name", "x"] ]
 *
 * Output: { id: 1; name: "x" }
 *
 * Two moves, both standard type-level idiom:
 *
 *   1. Iterate the KEY SET. The keys are the union of every pair's first slot:
 *        K in T[number][0]   →   "id" | "name"
 *      (`T[number]` is the union of all element types of the tuple; `[0]` reads
 *      the first slot of each, giving the union of keys.)
 *
 *   2. For each key K, recover its value type by *finding the matching pair*
 *      and reading its `[1]` slot:
 *        Extract<T[number], readonly [K, unknown]>[1]
 *      `Extract` keeps only the pair(s) whose first element is exactly `K`; the
 *      result is the pair `readonly [K, V]`, and `[1]` pulls out `V`.
 *
 * Why `readonly [K, unknown]` and not `readonly [K, any]`?  Because `any` would
 * also match pairs whose first element is merely *assignable* to K (looser),
 * and it pollutes the result with `any`. `unknown` is strict: only the literal
 * `[1]` slot is unbound, so `Extract` is exact.
 *
 * ── TupleToObject<T> ─────────────────────────────────────────────────────────
 *
 * Simpler: every key in `T[number]` maps to itself. No lookup needed. This is
 * the classic "tuple of keys → self-keyed object", useful for enum-like lookup
 * tables built from a literal union.
 */

import { assert, describe, assertEquals, expectTypeOf } from "@lib";

type Entry = readonly [PropertyKey, unknown];

// explanation: iterate the union of first-elements; for each key K, find its
// pair with Extract and project out the value at index 1.
type ObjectFromEntries<T extends readonly Entry[]> = {
  [K in T[number][0]]: Extract<T[number], readonly [K, unknown]>[1];
};

// explanation: map every key in the tuple to itself — a self-referential record.
type TupleToObject<T extends readonly PropertyKey[]> = {
  [K in T[number]]: K;
};

// CHECKS — compile-time.
const entries = [["id", 1], ["name", "x"]] as const;
const colors = ["red", "green", "blue"] as const;

expectTypeOf<ObjectFromEntries<typeof entries>>().toEqualTypeOf<{
  id: 1;
  name: "x";
}>();

expectTypeOf<TupleToObject<typeof colors>>().toEqualTypeOf<{
  red: "red";
  green: "green";
  blue: "blue";
}>();

// A duplicate-key case: the later pair wins (mirrors `Object.fromEntries` at
// runtime), and the value type is the union of both — `Extract` returns the
// union of every matching pair's value. Document the behaviour explicitly.
const dups = [["k", "a"], ["k", 2]] as const;
expectTypeOf<ObjectFromEntries<typeof dups>>().toEqualTypeOf<{ k: "a" | 2 }>();

// Non-string keys (number & symbol) work too, since the constraint is PropertyKey.
const mixed = [[0, "zero"], ["one", 1]] as const;
expectTypeOf<ObjectFromEntries<typeof mixed>>().toEqualTypeOf<{
  0: "zero";
  one: 1;
}>();

// RUNTIME — mirror the type with a tiny value-level `fromEntries` so we can
// exercise the behaviour end to end.
function fromEntries<T extends readonly Entry[]>(
  pairs: T,
): ObjectFromEntries<T> {
  // Build with a widening cast; the *type* is the precise ObjectFromEntries<T>.
  return Object.fromEntries(pairs) as ObjectFromEntries<T>;
}

describe("01-object-from-entries runtime checks", () => {
  const obj = fromEntries(entries);
  assertEquals({ id: obj.id, name: obj.name }, { id: 1, name: "x" });

  // TupleToObject mirror: build a self-keyed lookup at runtime.
  const lookup = Object.fromEntries(colors.map((c) => [c, c])) as TupleToObject<
    typeof colors
  >;
  assert(lookup.red === "red", "self-keyed lookup works");
  assert(lookup.blue === "blue", "every key maps to itself");

  // fromEntries round-trips through Object.entries losslessly for plain data.
  // (`Object.entries` widens to `[string, ...][]`, so we bridge via `unknown`.)
  const roundTrip = fromEntries(
    Object.entries(obj) as unknown as typeof entries,
  );
  assertEquals({ id: roundTrip.id, name: roundTrip.name }, { id: 1, name: "x" });
});
