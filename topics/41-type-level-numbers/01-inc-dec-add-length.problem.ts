/**
 * PROMPT — Naturals as tuples: Inc / Dec / Add / Length
 *
 * TypeScript has no type-level integers. But a tuple carries its `length` as a
 * literal type, so we can encode the natural number `N` as "a tuple with `N`
 * elements". Once we have that representation, arithmetic is just tuple
 * manipulation:
 *
 *   - `Inc<N>`  — push one more element on the end.
 *   - `Dec<N>`  — pop one element off the front.
 *   - `Add<A,B>`— concatenate two tuples (lengths add).
 *   - `Length<N>`— read `N["length"]`.
 *
 * Your job: replace each `TODO` with the real implementation. The CHECKS at the
 * bottom fail until you do.
 *
 * Rules:
 *   - Use ONLY type aliases (no `function`, no runtime). This is pure types.
 *   - Do not use `any`. `unknown` is the filler element (it carries no info).
 *   - `Dec` of `Zero` should clamp to `Zero` (dec 0 == 0), not `never`.
 *
 * Run:  npx tsc --noEmit 01-inc-dec-add-length.problem.ts
 */

import type { IsEqual } from "@lib";
import { expectTypeOf } from "@lib";

// A natural number N is encoded as a tuple of length N (readonly for safety).
type Nat = readonly unknown[];
type Zero = readonly [];

// TODO: implement Inc, Dec, Add, Length.
type Inc<N extends Nat> = TODO;
type Dec<N extends Nat> = TODO;
type Add<A extends Nat, B extends Nat> = TODO;
type Length<N extends Nat> = TODO;

// Hand-built literals for the CHECKS (no recursion yet — just spell them out).
type _1 = readonly [unknown];
type _2 = readonly [unknown, unknown];
type _3 = readonly [unknown, unknown, unknown];

// CHECKS — make these compile.
expectTypeOf<Inc<Zero>>().toEqualTypeOf<_1>();
expectTypeOf<Inc<_2>>().toEqualTypeOf<_3>();

expectTypeOf<Dec<_3>>().toEqualTypeOf<_2>();
expectTypeOf<Dec<Zero>>().toEqualTypeOf<Zero>(); // clamp at 0

expectTypeOf<Add<_1, _2>>().toEqualTypeOf<_3>();
expectTypeOf<Add<_2, _2>>().toEqualTypeOf<readonly [unknown, unknown, unknown, unknown]>();

expectTypeOf<Length<_3>>().toEqualTypeOf<3>();
expectTypeOf<Length<Add<_2, _3>>>().toEqualTypeOf<5>();

// Bonus: Length gives us a way to read the result of Add back as a number.
expectTypeOf<Length<Inc<Inc<Inc<Zero>>>>>().toEqualTypeOf<3>();
