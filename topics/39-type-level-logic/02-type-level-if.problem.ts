/**
 * PROMPT — Type-level If<C, A, B>
 *
 * Implement a type-level conditional:
 *
 *     type If<C extends boolean, A, B = never> = any;   // TODO
 *
 *   - If C is `true`,  the result is `A`.
 *   - If C is `false`, the result is `B` (which defaults to `never`).
 *
 * Use a conditional type (`C extends true ? A : B`). Then think about what
 * `If<boolean, A, B>` should be — when C is the full `boolean` union,
 * distribution gives you the union of both branches.
 *
 * Run:  npx tsc --noEmit 02-type-level-if.problem.ts
 */

import { expectTypeOf } from "@lib";

// TODO: implement If<C, A, B>.
type If<C extends boolean, A, B = never> = any;

// CHECKS — FAIL until your If is correct.

expectTypeOf<If<true, string, number>>().toEqualTypeOf<string>();
expectTypeOf<If<false, string, number>>().toEqualTypeOf<number>();

expectTypeOf<If<true, string>>().toEqualTypeOf<string>();
expectTypeOf<If<false, string>>().toBeNever();

expectTypeOf<If<boolean, string, number>>().toEqualTypeOf<string | number>();
