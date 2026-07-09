/**
 * PROMPT — `as const` and literal widening
 *
 * TypeScript **widens** literal types (`"hi"` → `string`, `42` → `number`,
 * `true` → `boolean`) whenever a value is stored somewhere it could later be
 * changed. The classic rules:
 *
 *   - `const x = "hi"`          → `x: "hi"`      (immutable binding, no widening)
 *   - `let   x = "hi"`          → `x: string`    (reassignable, widened)
 *   - `const o = { kind: "x" }` → `o.kind: string` (object props are mutable)
 *   - `const xs = [1, 2]`       → `xs: number[]`   (arrays are mutable)
 *
 * `as const` opts out of all of that: every literal freezes to its narrowest
 * form and every property/element becomes `readonly`.
 *
 * Your job:
 *   1. For each TODO below, predict the INFERRED type without `as const`.
 *   2. Add `as const` where indicated so the CHECKS compile.
 *
 * Run:  npx tsc --noEmit 01-literal-widening.problem.ts
 */

const a = "hello";                 // ❓ type of `a`?
let b = "hello";                   // ❓ type of `b`?
const obj = { kind: "circle" };    // ❓ type of `obj.kind`? (add `as const`)
const arr = ["a", "b"];            // ❓ type of `arr`?      (add `as const`)

// TODO: write the correct inferred types / apply `as const` so the CHECKS pass.

import { expectTypeOf } from "@lib";

// CHECKS — fix the bindings above until all of these compile.
expectTypeOf<typeof a>().toEqualTypeOf<"hello">();
expectTypeOf<typeof b>().toEqualTypeOf<string>();
expectTypeOf<typeof obj.kind>().toEqualTypeOf<"circle">();   // needs `as const`
expectTypeOf<typeof arr>().toEqualTypeOf<readonly ["a", "b"]>(); // needs `as const`
