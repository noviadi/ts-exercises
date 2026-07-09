/**
 * SOLUTION — Structural assignability
 *
 * TypeScript compares types by *shape*. The golden rule of assignability:
 *
 *   "Source `S` is assignable to target `T` if `S` has at least all the
 *    members `T` requires (with compatible types)."
 *
 *   ➜ A type with MORE properties is assignable to a type with FEWER.
 *     (a `User` IS a `NamedUser`, because a User has a name — it "quacks".)
 *
 *   ➜ A type with FEWER properties is NOT assignable to a type with MORE.
 *     (a `NamedUser` is NOT a `User` — we can't prove it has an `age`.)
 *
 * Assertion vocabulary (from `expect-type`):
 *   - `toExtend<T>()`      — "the actual type IS assignable to T" (a.k.a. extends)
 *   - `toEqualTypeOf<T>()` — "the actual type is *identical* to T"
 *   - prefix `.not.`       to assert the opposite (and it must then be true)
 */

type User = { name: string; age: number };
type NamedUser = { name: string };
// explanation: the empty object type `{}` has NO required members, so EVERY
// non-null/undefined value is assignable to it — the classic "empty type
// accepts anything" trap. (Note: this is NOT the same as `Record<string,
// never>` — that one requires every value to be assignable to `never`, so
// almost nothing is assignable to it!)
type Empty = {};

import { expectTypeOf } from "@lib";

// CHECKS — these all pass; read them as documentation of the model.

// User has name+age, so it satisfies the { name: string } requirement:
expectTypeOf<User>().toExtend<NamedUser>();

// NamedUser is missing `age`, so it does NOT satisfy User:
// @ts-expect-error  NamedUser lacks `age`
expectTypeOf<NamedUser>().toExtend<User>();

// Identical shapes are identical types (the type's name doesn't matter):
expectTypeOf<User>().toEqualTypeOf<{ name: string; age: number }>();

// The empty-type trap: any object (and any primitive) is assignable to `Empty`,
// because it requires nothing. If you ever catch yourself writing `{}` or
// `Record<string, unknown>` as a "placeholder", reach for a real type instead.
expectTypeOf<User>().toExtend<Empty>();
expectTypeOf<string>().toExtend<Empty>();
