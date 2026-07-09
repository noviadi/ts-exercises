/**
 * SOLUTION — Where `type` aliases win: unions, recursion, mapped types
 *
 * A `type` alias can name ANY type — unions, intersections, tuples, primitives,
 * conditionals, and mapped types. `interface` is restricted to the shape
 * `{ knownKeys: types }`. The moment you need one of those other constructs,
 * you MUST reach for `type`.
 *
 * Caveat on naming: two `type` aliases with the same name DO collide (unlike
 * `interface`, which merges). That is the trade-off — you get expressiveness,
 * but you lose augmentation.
 */

// explanation: a union of string literals. There is no `interface` syntax for
// "this OR that" — unions are exclusive to type-alias space.
type Status = "loading" | "success" | "error";

// explanation: a recursive type. Each member of the union is checked: `Json`
// can be a primitive, an array of `Json` (self-reference), or a record whose
// values are themselves `Json`. Interfaces CAN be recursive too, but composing
// recursion with unions and index signatures this naturally only works as an
// alias.
type Json =
  | null
  | boolean
  | number
  | string
  | Status
  | Json[]
  | { [key: string]: Json };

// explanation: a MAPPED type. The `[K in keyof T]` syntax iterates over the
// keys of whatever `T` is passed in, and the `readonly` modifier makes each
// property read-only. This is literally how TS's built-in `Readonly<T>` is
// defined. `interface` has no equivalent of "loop over another type's keys".
type AllReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — all pass; read them as documentation.

// `Status` is the finite union, NOT the wide `string`.
expectTypeOf<Status>().toEqualTypeOf<"loading" | "success" | "error">();
expectTypeOf<Status>().toExtend<string>(); // every literal is assignable to string
// @ts-expect-error  string is not assignable to the narrow union
expectTypeOf<string>().toExtend<Status>();

// `Json` accepts a nested object whose values are themselves `Json`.
expectTypeOf<{ ok: boolean; nested: { n: number } }>().toExtend<Json>();
// ...and a `null` leaf, and an array of mixed leaves.
expectTypeOf<null>().toExtend<Json>();
expectTypeOf<Array<string | boolean>>().toExtend<Json>();

// `AllReadonly<T>` keeps the same keys & value types, but adds `readonly`.
type Sample = { a: string; b: number };
expectTypeOf<AllReadonly<Sample>>().toEqualTypeOf<{ readonly a: string; readonly b: number }>();

// Runtime check: a real JSON value flows through a function typed with `Json`.
describe("recursive Json type accepts real JSON", () => {
  const value: Json = { ok: true, items: ["loading", "success"] };
  assert(value !== null, "non-null JSON object accepted");
});
