/**
 * SOLUTION — Conditional types as a type-level `if`
 *
 * The grammar:
 *
 *   T extends U ? X : Y
 *     │     │      │   │
 *     │     │      │   └─ "else" type
 *     │     │      └─ "then" type
 *     │     └─ the test: "is T assignable to U?"
 *     └─ the value being tested
 *
 * `extends` here is *assignability*, the same relation as Topic 01 — a value of
 * type `T` must be safely usable as a `U`. It is NOT class inheritance.
 *
 * Two idioms make utility types tick:
 *
 *   • Returning `never` in one branch *erases* the matched member from a union,
 *     because `A | never === A`. That is how `Exclude` and `NonNullable` work.
 *
 *   • The condition is checked for EACH member of a union separately
 *     ("distribution" — Topic 07), so per-member filtering "just works".
 */

// explanation: plain type-level boolean. If `T` is assignable to `string`,
// the literal `true`; otherwise the literal `false`. (Note: the result is the
// literal type `true`/`false`, not the widened `boolean` — that's what makes
// it usable as a type-level flag.)
type IsString<T> = T extends string ? true : false;

// explanation: rebuild of `Exclude<T, U>`. For each member `M` of `T`, if `M`
// is assignable to `U`, drop it (return `never`); otherwise keep it (return
// `M`). Returning `never` erases the member from the resulting union.
type MyExclude<T, U> = T extends U ? never : T;

// explanation: rebuild of `NonNullable<T>`. It is just `Exclude` specialised to
// `U = null | undefined`: drop anything assignable to `null` or `undefined`.
type MyNonNullable<T> = T extends null | undefined ? never : T;

import { expectTypeOf } from "@lib";

// CHECKS — all pass.

// IsString collapses to the literal `true` / `false`, not the widened `boolean`:
expectTypeOf<IsString<"hello">>().toEqualTypeOf<true>();
expectTypeOf<IsString<42>>().toEqualTypeOf<false>();

// Exclude drops exactly the assignable members and keeps the rest:
expectTypeOf<MyExclude<"a" | "b" | "c", "b">>().toEqualTypeOf<"a" | "c">();

// NonNullable is Exclude with U = null | undefined:
expectTypeOf<MyNonNullable<string | null | undefined>>().toEqualTypeOf<string>();

// 💡 These are byte-for-byte the same definitions TS uses in lib.d.ts:
//     type Exclude<T, U>      = T extends U ? never : T;
//     type NonNullable<T>     = T extends null | undefined ? never : T;
//   Once you can write these, you can write any filter-style utility.
