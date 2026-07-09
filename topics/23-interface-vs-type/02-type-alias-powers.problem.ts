/**
 * PROMPT — Where `type` aliases win: unions, recursion, mapped types
 *
 * `interface` can only describe object shapes. A `type` alias can name ANY
 * type — including ones that are impossible to express with `interface`:
 *
 *   - **Unions** (`A | B`)            — interface has no `|`.
 *   - **Recursion** that's awkward     — interfaces can recurse but aliases
 *     compose far more naturally with conditionals.
 *   - **Mapped/conditional types**     — `{ [K in keyof T]: ... }` and
 *     `T extends U ? X : Y` only exist in alias form.
 *
 * Tasks:
 *   1. Replace each `TODO` with the correct `type` alias. (Do NOT use
 *      `interface` — none of these can be expressed as one.)
 *   2. Fix the CHECKS so they pass.
 *
 * Run:  npx tsc --noEmit 02-type-alias-powers.problem.ts
 */

// TODO: a union of the literal strings "loading" | "success" | "error".
type Status = TODO;

// TODO: a self-referential JSON type: null, boolean, number, string,
// Status[], or { [key: string]: Json }.
type Json = TODO;

// TODO: a mapped type that takes any object type T and makes every value
// readonly (hand-rebuilt `Readonly<T>`).
type AllReadonly<T> = TODO;

import { expectTypeOf } from "@lib";

// CHECKS — fix them to describe the real types.
expectTypeOf<Status>().toEqualTypeOf<string>(); // ❓ it's a finite union, not string
expectTypeOf<Json>().toExtend<{ a: Json }>(); // ❓ recursive object?
type Sample = { a: string; b: number };
expectTypeOf<AllReadonly<Sample>>().toEqualTypeOf<Sample>(); // ❓ now readonly
