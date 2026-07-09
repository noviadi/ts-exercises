/**
 * PROMPT — Nested ternary chains: type-level `if / else if / else`
 *
 * Because each conditional's branches are themselves types, you can nest them:
 *
 *   type Classify<T> =
 *     T extends string  ? "string"  :
 *     T extends number  ? "number"  :
 *     T extends boolean ? "boolean" :
 *     /* else *​/                    "other";
 *
 * Read it exactly like `if / else if / ... / else`. The first matching branch
 * wins; the final fallback plays the role of a trailing `else`.
 *
 * Your job:
 *   1. Implement `TypeName<T>` returning the string name of T's primitive kind
 *      (handle string, number, boolean, null, undefined, function, and
 *      "object" as the catch-all).
 *   2. Implement `If<C, T, F>` — given a type-level boolean `C`, return `T`
 *      when `C extends true`, otherwise `F`.
 *
 * Run:  npx tsc --noEmit 02-nested-ternary-chains.problem.ts
 */

// TODO: classify T into a string literal.
type TypeName<T> = TODO;

// TODO: a tiny type-level ternary on a boolean condition.
type If<C extends boolean, T, F> = TODO;

// ---------------------------------------------------------------------------
// Fix the types above; the CHECKS below must compile once you do.
// ---------------------------------------------------------------------------

import { expectTypeOf } from "@lib";

// CHECKS — these fail until TypeName and If are correct.
expectTypeOf<TypeName<"hi">>().toEqualTypeOf<"string">();
expectTypeOf<TypeName<true>>().toEqualTypeOf<"boolean">();
expectTypeOf<TypeName<() => void>>().toEqualTypeOf<"function">();
expectTypeOf<TypeName<null>>().toEqualTypeOf<"null">();
expectTypeOf<TypeName<{ a: 1 }>>().toEqualTypeOf<"object">();

expectTypeOf<If<true, "yes", "no">>().toEqualTypeOf<"yes">();
expectTypeOf<If<false, "yes", "no">>().toEqualTypeOf<"no">();
