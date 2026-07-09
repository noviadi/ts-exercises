/**
 * PROMPT — ObjectFromEntries & TupleToObject
 *
 * Two "tuple → object" conversions:
 *
 *   1. `ObjectFromEntries<T>` — given a tuple of `[K, V]` pairs, build the
 *      object type `{ K1: V1; K2: V2; ... }` preserving literal keys and values.
 *
 *      Example: `[["id", 1], ["name", "x"]] as const`  →  `{ id: 1; name: "x" }`.
 *
 *   2. `TupleToObject<T>` — given a tuple of literal keys, build an object that
 *      maps each key to itself. Handy for building lookup tables / enums.
 *
 *      Example: `["red", "green", "blue"] as const`  →
 *               `{ red: "red"; green: "green"; blue: "blue" }`.
 *
 * Hints:
 *   - For `ObjectFromEntries`, the mapped key set is `T[number][0]` (the union
 *     of all first elements). To recover each value, find the pair whose first
 *     element equals the key and read its `[1]` slot. `Extract` does the
 *     "find the matching pair" job.
 *   - For `TupleToObject`, every key just maps to itself — no `Extract` needed.
 *
 * Rules: pure types, no `any`. Use `PropertyKey` for the key constraint.
 *
 * Run:  npx tsc --noEmit 01-object-from-entries.problem.ts
 */

import { expectTypeOf } from "@lib";

// A pair is a readonly 2-tuple of [key, value].
type Entry = readonly [PropertyKey, unknown];

// TODO: implement.
type ObjectFromEntries<T extends readonly Entry[]> = TODO;

type TupleToObject<T extends readonly PropertyKey[]> = TODO;

// CHECKS — make these compile.
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
