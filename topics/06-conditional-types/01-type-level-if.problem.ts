/**
 * PROMPT — Conditional types as a type-level `if`
 *
 * `T extends U ? X : Y` picks `X` when `T` is assignable to `U`, else `Y`.
 * The `extends` is the SAME assignability relation you met in Topic 01.
 *
 * Your job — implement three utility types from scratch:
 *
 *   1. `IsString<T>`        → `true` if `T` is assignable to `string`, else `false`.
 *   2. `MyExclude<T, U>`    → the members of `T` that are NOT assignable to `U`.
 *   3. `MyNonNullable<T>`   → `T` with `null` and `undefined` removed.
 *
 * Hint for Exclude/NonNullable: when `T` is a union and the condition matches
 * a member, returning `never` *removes* it from the union (`never` vanishes
 * from unions — `A | never` is just `A`). (Why it removes *each* matching
 * member rather than the whole union is Topic 07 — distribution.)
 *
 * Run:  npx tsc --noEmit 01-type-level-if.problem.ts
 */

// TODO: `true` when T is a string, else `false`.
type IsString<T> = TODO;

// TODO: drop members of T assignable to U (rebuild Exclude).
type MyExclude<T, U> = TODO;

// TODO: drop null and undefined from T (rebuild NonNullable).
type MyNonNullable<T> = TODO;

// ---------------------------------------------------------------------------
// Fix the types above; the CHECKS below must compile once you do.
// ---------------------------------------------------------------------------

import { expectTypeOf } from "@lib";

// CHECKS — these fail until the three types are correct.
expectTypeOf<IsString<"hello">>().toEqualTypeOf<true>();
expectTypeOf<IsString<42>>().toEqualTypeOf<false>();

expectTypeOf<MyExclude<"a" | "b" | "c", "b">>().toEqualTypeOf<"a" | "c">();

expectTypeOf<MyNonNullable<string | null | undefined>>().toEqualTypeOf<string>();
