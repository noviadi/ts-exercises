/**
 * SOLUTION — Keys<T> and Values<T> as literal tuples
 *
 * ── The central fact ─────────────────────────────────────────────────────────
 *
 * A **homomorphic** mapped type — one written as `{ [K in keyof T]: F<K> }` —
 * when `T` is a *tuple* produces another *tuple of the same length*, mapping
 * each position element-wise. The same syntax that remaps an object's
 * properties remaps a tuple's positions. (See Topic 08 on homomorphism.)
 *
 * So:
 *
 *   type Keys<T>   = { [K in keyof T]: K };     // each position → its own index
 *   type Values<T> = { [K in keyof T]: T[K] };  // each position → its element
 *
 * For `readonly [string, number, boolean]`:
 *
 *   Keys<T>   = readonly ["0", "1", "2"]            ← a TUPLE of index strings
 *   Values<T> = readonly [string, number, boolean]  ← a TUPLE (here, identity)
 *
 * ── Why this is not the same as keyof / T[number] ──────────────────────────
 *
 *   keyof T      = "0" | "1" | "2"           ← a UNION, ordering lost
 *   T[number]    = string | number | boolean ← a UNION, ordering + multiplicity lost
 *
 * A tuple `[A, A, B]` and `[A, B]` have the SAME `T[number]` union (`A | B`) but
 * DIFFERENT `Values<T>` tuples. The tuple form preserves length and order; the
 * union form does not. When you need "exactly these N values in this order",
 * reach for the homomorphic map, not `T[number]`.
 *
 * ── Why we scope this to tuples ───────────────────────────────────────────────
 *
 * For a general *object* type, key order is NOT guaranteed by the language
 * (declaration order is a de-facto convention but not a contract the type system
 * tracks). So a typed `Keys<{ a: 1; b: 2 }>` cannot promise `["a", "b"]` vs
 * `["b", "a"]`. Tuples, by contrast, have an intrinsic order — that's why we
 * constrain `T extends readonly unknown[]` here.
 *
 * Bonus: `Entries<T>` (object → tuple of `[K, V]` pairs) has the same ordering
 * caveat for objects; for tuples it's well-defined:
 *
 *   type Entries<T extends readonly unknown[]> = { [K in keyof T]: [K, T[K]] };
 *   // Entries<[string, number]> = [["0", string], ["1", number]]
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation: homomorphic map over a tuple → tuple. K binds to each index
// literal ("0","1",...), so emitting K gives the index keys as a tuple.
type Keys<T extends readonly unknown[]> = { [K in keyof T]: K };

// explanation: same shape, but emit T[K] — the element type at that position.
// This is structurally the identity on tuples, but it nails down "a tuple of
// these value types" so it can be contrasted with the `T[number]` union.
type Values<T extends readonly unknown[]> = { [K in keyof T]: T[K] };

// CHECKS — compile-time.
type Tuple = readonly [string, number, boolean];

expectTypeOf<Keys<Tuple>>().toEqualTypeOf<readonly ["0", "1", "2"]>();
expectTypeOf<Values<Tuple>>().toEqualTypeOf<
  readonly [string, number, boolean]
>();

// The union contrast. `Values<T>` is a TUPLE (ordered, fixed length); the
// indexed-access form `T[number]` is a UNION (unordered, deduped):
expectTypeOf<Tuple[number]>().toEqualTypeOf<string | number | boolean>();

// Note on `keyof`: you might expect `keyof Tuple` to be just `"0" | "1" | "2"`,
// but a tuple ALSO inherits every `Array` prototype member (`length`, `map`,
// `toString`, …) plus the `number` index signature. So `keyof Tuple` is a wide,
// polluted union — which is exactly why `Keys<T>` (the homomorphic map) is the
// clean way to recover just the positional index strings as a tuple.
expectTypeOf<"0" | "1" | "2">().toExtend<keyof Tuple>();

// The multiplicity point: [A, A, B] vs [A, B] share a union but differ as tuples.
type Repeated = readonly [string, string, boolean];
expectTypeOf<Values<Repeated>>().toEqualTypeOf<
  readonly [string, string, boolean]
>();
expectTypeOf<Repeated[number]>().toEqualTypeOf<string | boolean>();

// Bonus: Entries on a tuple yields a tuple of [index, element] pairs.
type Entries<T extends readonly unknown[]> = { [K in keyof T]: [K, T[K]] };
expectTypeOf<Entries<Tuple>>().toEqualTypeOf<
  readonly [["0", string], ["1", number], ["2", boolean]]
>();

// RUNTIME — there's no real "object → ordered tuple" at runtime, but we can
// materialise a tuple's keys/values and check them.
describe("02-keys-values runtime checks", () => {
  const t: Tuple = ["hello", 42, true];

  // The index keys of a tuple, in order.
  const keys = Object.keys(t) as unknown as Keys<Tuple>;
  assert(keys[0] === "0" && keys[1] === "1" && keys[2] === "2", "index keys");

  // The values, in order — `[...t]` keeps length and order.
  const vals: Values<Tuple> = [...t];
  assert(vals.length === 3, "values tuple keeps length");
  assert(typeof vals[0] === "string" && typeof vals[1] === "number", "types");
});
