/**
 * PROMPT — Boolean logic gates at the type level
 *
 * Implement four gates — `Not`, `And`, `Or`, `Xor` — PURELY in the type
 * system, operating on `boolean` (= `true | false`). No runtime code.
 *
 * Use conditional types. The patterns to aim for mirror runtime short-circuit
 * evaluation:
 *
 *     And<A, B>  → "if A is false, the answer is false; else B"
 *     Or<A, B>   → "if A is true,  the answer is true;  else B"
 *
 *     type Not<B extends boolean> = any;  // TODO
 *     type And<A extends boolean, B extends boolean> = any;  // TODO
 *     type Or<A extends boolean, B extends boolean> = any;   // TODO
 *     type Xor<A extends boolean, B extends boolean> = any;  // TODO
 *
 * Run:  npx tsc --noEmit 01-boolean-gates.problem.ts
 */

import { expectTypeOf } from "@lib";

// TODO: implement the four gates.
type Not<B extends boolean> = any;
type And<A extends boolean, B extends boolean> = any;
type Or<A extends boolean, B extends boolean> = any;
type Xor<A extends boolean, B extends boolean> = any;

// CHECKS — the full truth table; FAILS until all four gates are correct.

expectTypeOf<Not<true>>().toEqualTypeOf<false>();
expectTypeOf<Not<false>>().toEqualTypeOf<true>();

expectTypeOf<And<true, true>>().toEqualTypeOf<true>();
expectTypeOf<And<true, false>>().toEqualTypeOf<false>();
expectTypeOf<And<false, true>>().toEqualTypeOf<false>();
expectTypeOf<And<false, false>>().toEqualTypeOf<false>();

expectTypeOf<Or<true, true>>().toEqualTypeOf<true>();
expectTypeOf<Or<true, false>>().toEqualTypeOf<true>();
expectTypeOf<Or<false, true>>().toEqualTypeOf<true>();
expectTypeOf<Or<false, false>>().toEqualTypeOf<false>();

expectTypeOf<Xor<true, true>>().toEqualTypeOf<false>();
expectTypeOf<Xor<true, false>>().toEqualTypeOf<true>();
expectTypeOf<Xor<false, true>>().toEqualTypeOf<true>();
expectTypeOf<Xor<false, false>>().toEqualTypeOf<false>();
