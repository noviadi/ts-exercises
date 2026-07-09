/**
 * PROMPT — Mapped type basics
 *
 * A mapped type loops over the keys of an object type and transforms each
 * property's value type:
 *
 *   type Mapped<T> = { [K in keyof T]: SomeTransformation<T[K]> };
 *
 * Below are four classic utilities stubbed out with `any`. Re-implement each
 * using a mapped type (no built-in `Partial`/`Readonly` allowed):
 *
 *   - MyReadonly<T>   — every property becomes `readonly`
 *   - MyPartial<T>    — every property becomes optional (`?`)
 *   - Stringify<T>    — every property's value type becomes `string`
 *   - Nullable<T>     — every property's value type becomes `T[K] | null`
 *
 * Rules:
 *   - Do NOT change the `User` definition or the CHECKS.
 *   - Replace each `any` with a real mapped type.
 *
 * Run:  npx tsc --noEmit 01-mapped-basics.problem.ts
 */

type User = { name: string; age: number };

// TODO: replace each `any` with the mapped type described above.
type MyReadonly<T> = any;
type MyPartial<T> = any;
type Stringify<T> = any;
type Nullable<T> = any;

import { expectTypeOf } from "@lib";

// CHECKS — these fail until you implement the four types above correctly.
expectTypeOf<MyReadonly<User>>().toEqualTypeOf<Readonly<User>>();
expectTypeOf<MyPartial<User>>().toEqualTypeOf<Partial<User>>();
expectTypeOf<Stringify<User>>().toEqualTypeOf<{ name: string; age: string }>();
expectTypeOf<Nullable<User>>().toEqualTypeOf<{ name: string | null; age: number | null }>();
