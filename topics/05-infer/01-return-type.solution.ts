/**
 * SOLUTION — Reimplement `ReturnType` with `infer`
 *
 * `infer R` is type-level destructuring. In:
 *
 *   type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
 *
 * we ask TypeScript: "if `T` looks like a function whose return type is some
 * `R`, what is `R`?" TS solves for `R` and binds it in the `true` branch.
 *
 * Anatomy of the pattern:
 *   T extends Shape<infer X> ? UseX : Fallback
 *      │       │                │       │
 *      │       │                │       └─ "didn't match" branch
 *      │       │                └─ "matched" branch — X is in scope here
 *      │       └─ the shape to match, with `infer` holes
 *      └─ the type being inspected
 *
 * The matched `R` is ONLY in scope inside the `true` branch — you cannot
 * reference it after the `:` (that's the `never` fallback's whole job).
 */

// explanation: `(...args: any[]) => infer R` matches ANY function type, because
// parameters are contravariant and `any[]` accepts every argument list. We use
// `any[]` deliberately (matching TS's own `lib.d.ts`); `never[]` would also work
// for matching, but `any[]` is the idiomatic, readable choice.
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

import { expectTypeOf } from "@lib";

type Greet = (name: string) => string;
type Counter = () => number;
type Variadic = (...nums: number[]) => boolean;

// CHECKS — all pass; each one documents a property of the implementation.

// `infer R` binds R = string for `Greet`:
expectTypeOf<MyReturnType<Greet>>().toEqualTypeOf<string>();
// A zero-arg function still matches `(...args: any[])` (an empty argument list):
expectTypeOf<MyReturnType<Counter>>().toEqualTypeOf<number>();
// Rest parameters are captured by `any[]` and don't disturb the return type:
expectTypeOf<MyReturnType<Variadic>>().toEqualTypeOf<boolean>();

// A non-function does NOT match the function shape, so we land in `never`:
expectTypeOf<MyReturnType<number>>().toEqualTypeOf<never>();

// 💡 This is EXACTLY how TS's built-in `ReturnType<T>` is defined in lib.d.ts:
//     type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any;
// The built-in adds a constraint `T extends (...args: any) => any` so that passing
// a non-function is a *compile error* at the call site, whereas our `never`
// fallback silently returns `never`. Both are defensible design choices.
