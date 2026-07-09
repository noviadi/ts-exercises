/**
 * SOLUTION — Mapped type basics
 *
 * The mapped-type shape, annotated:
 *
 *       type Mapped<T> = { [K in keyof T]: F<T[K]> };
 *       //                  ^^^^^^^^^^^^^  ^^^^^^
 *       //                  the "loop"     the body: per-key transformation
 *
 *   - `[K in keyof T]` iterates every key `K` of `T` (it is the type-level
 *     equivalent of `for (const k of Object.keys(t))`).
 *   - `T[K]` is *indexed access*: the value type at key `K`.
 *   - The body can be ANYTHING — `T[K]`, `T[K] | null`, `string`, a
 *     conditional, a recursive call… whatever you put there is applied to
 *     every property.
 *
 * Modifiers (`readonly`, `?`) are written as a *prefix* on the clause:
 *
 *       { readonly [K in keyof T]: T[K] }   // every prop readonly
 *       { [K in keyof T]?:      T[K] }      // every prop optional
 *
 * These are the literal definitions TS itself uses for `Readonly<T>` and
 * `Partial<T>` — which is why our hand-rolled copies compare *identical*.
 */

type User = { name: string; age: number };

// explanation: `readonly [K in keyof T]` stamps `readonly` on every property
// without touching its value type. Identical to the built-in `Readonly<T>`.
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

// explanation: the `?` suffix on the iteration clause makes every property
// optional. Under `exactOptionalPropertyTypes` this still matches `Partial<T>`
// exactly, because both produce "optional property of T[K]".
type MyPartial<T> = { [K in keyof T]?: T[K] };

// explanation: the value type is REPLACED wholesale — whatever T[K] was, it is
// now `string`. Modifiers like `readonly` would be preserved here (homomorphic
// mapped types carry them through — see 02-pick-record-homomorphic), but the
// value type itself is fully overridden.
type Stringify<T> = { [K in keyof T]: string };

// explanation: the body is just a union. T[K] is preserved and `| null` is
// added — the classic "make every field nullable" helper for DB rows, JSON
// decoders, etc.
type Nullable<T> = { [K in keyof T]: T[K] | null };

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — compile-time.

// Hand-rolled MyReadonly<User> IS structurally identical to Readonly<User>:
expectTypeOf<MyReadonly<User>>().toEqualTypeOf<Readonly<User>>();
expectTypeOf<MyReadonly<User>>().toEqualTypeOf<{
  readonly name: string;
  readonly age: number;
}>();

// MyPartial<User> is identical to Partial<User>:
expectTypeOf<MyPartial<User>>().toEqualTypeOf<Partial<User>>();
expectTypeOf<MyPartial<User>>().toEqualTypeOf<{ name?: string; age?: number }>();

// Stringify replaces the value type wholesale (note: name was string, now
// still string; age was number, now string):
expectTypeOf<Stringify<User>>().toEqualTypeOf<{ name: string; age: string }>();

// Nullable unions `null` onto every value type:
expectTypeOf<Nullable<User>>().toEqualTypeOf<{
  name: string | null;
  age: number | null;
}>();

// Sanity: MyPartial<User> is NOT identical to User (it has optionals).
expectTypeOf<MyPartial<User>>().not.toEqualTypeOf<User>();

// RUNTIME — prove the utilities describe the shapes we think they do. A
// `Partial<User>` value (only `name`) must be assignable everywhere we expect
// optionality.
describe("01-mapped-basics runtime checks", () => {
  const partial: MyPartial<User> = { name: "Ada" };
  assert(partial.name === "Ada", "name should pass through");

  const nullable: Nullable<User> = { name: null, age: 42 };
  assert(nullable.age === 42, "concrete number passes through Nullable");
  assert(nullable.name === null, "null is allowed on a Nullable field");

  const stringified: Stringify<User> = { name: "Ada", age: "42" };
  assert(stringified.age === "42", "Stringify forced age to a string");
});
