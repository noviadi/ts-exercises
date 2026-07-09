/**
 * PROMPT — Reimplement `ReturnType` with `infer`
 *
 * `infer R` lets you declare a type variable *inside* the `extends` clause of a
 * conditional type. TypeScript then tries to solve for `R` so that the match
 * succeeds — like a pattern-match / destructuring at the type level.
 *
 * Your job:
 *   - Replace `TODO` with a conditional type that extracts the return type of
 *     any function `T`. If `T` is not a function, return `never`.
 *
 * Hint: the shape to match is `(...args: any[]) => R` and you want to `infer R`.
 *
 * Run:  npx tsc --noEmit 01-return-type.problem.ts
 */

// TODO: implement MyReturnType<T> using `infer`.
type MyReturnType<T> = TODO;

// ---------------------------------------------------------------------------
// Fix the type above; the CHECKS below must compile once you do.
// ---------------------------------------------------------------------------

import { expectTypeOf } from "@lib";

type Greet = (name: string) => string;
type Counter = () => number;
type Variadic = (...nums: number[]) => boolean;

// CHECKS — these fail until MyReturnType is correct.
expectTypeOf<MyReturnType<Greet>>().toEqualTypeOf<string>();
expectTypeOf<MyReturnType<Counter>>().toEqualTypeOf<number>();
expectTypeOf<MyReturnType<Variadic>>().toEqualTypeOf<boolean>();
expectTypeOf<MyReturnType<number>>().toEqualTypeOf<never>();
