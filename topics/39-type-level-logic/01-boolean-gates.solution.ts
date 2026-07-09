/**
 * SOLUTION — Boolean logic gates at the type level
 *
 * `boolean` in TS is the union `true | false`. A conditional type
 * `B extends true ? X : Y` therefore behaves exactly like an `if (B)`:
 *
 *     B = true  → X
 *     B = false → Y
 *
 * That single primitive is enough to express every boolean gate. The trick
 * is SHORT-CIRCUITING the same way `&&` / `||` do at runtime:
 *
 *     And<A, B> = A extends false ? false : B
 *                          ^^^^^^^^^^^^^^^
 *                          "as soon as A is false, the answer is false"
 *
 * Distribution note: because `A` and `B` are *naked* type parameters,
 * `A extends …` distributes over unions. So `And<boolean, boolean>` resolves
 * to `And<true|false, true|false>` = `false | boolean` = `boolean` — exactly
 * what we want (the gate of two unknowns is still a boolean).
 */

import { expectTypeOf } from "@lib";

// explanation: NOT flips the boolean. `B extends true ? false : true`.
//   - true  → false
//   - false → true
type Not<B extends boolean> = B extends true ? false : true;

// explanation: AND short-circuits on the LEFT operand. If A is false we
// already know the result is false; only when A is true does B decide.
//   - false, _    → false
//   - true,  B    → B
type And<A extends boolean, B extends boolean> = A extends false ? false : B;

// explanation: OR short-circuits on true. If A is true we already know the
// result is true; only when A is false does B decide.
//   - true,  _    → true
//   - false, B    → B
type Or<A extends boolean, B extends boolean> = A extends true ? true : B;

// explanation: XOR = "exactly one is true". Branch on A:
//   - A true  → result is NOT B   (B must be false)
//   - A false → result is B       (B must be true)
type Xor<A extends boolean, B extends boolean> = A extends true
  ? Not<B>
  : B;

// CHECKS — full truth table, every gate, every combination.

// ── NOT ───────────────────────────────────────────────────────────────────
expectTypeOf<Not<true>>().toEqualTypeOf<false>();
expectTypeOf<Not<false>>().toEqualTypeOf<true>();
// Distribution: Not<boolean> = Not<true> | Not<false> = false | true = boolean
expectTypeOf<Not<boolean>>().toEqualTypeOf<boolean>();

// ── AND (short-circuits on false) ─────────────────────────────────────────
expectTypeOf<And<true, true>>().toEqualTypeOf<true>();
expectTypeOf<And<true, false>>().toEqualTypeOf<false>();
expectTypeOf<And<false, true>>().toEqualTypeOf<false>();
expectTypeOf<And<false, false>>().toEqualTypeOf<false>();
expectTypeOf<And<boolean, boolean>>().toEqualTypeOf<boolean>();

// ── OR (short-circuits on true) ───────────────────────────────────────────
expectTypeOf<Or<true, true>>().toEqualTypeOf<true>();
expectTypeOf<Or<true, false>>().toEqualTypeOf<true>();
expectTypeOf<Or<false, true>>().toEqualTypeOf<true>();
expectTypeOf<Or<false, false>>().toEqualTypeOf<false>();
expectTypeOf<Or<boolean, boolean>>().toEqualTypeOf<boolean>();

// ── XOR (true iff exactly one input is true) ──────────────────────────────
expectTypeOf<Xor<true, true>>().toEqualTypeOf<false>();
expectTypeOf<Xor<true, false>>().toEqualTypeOf<true>();
expectTypeOf<Xor<false, true>>().toEqualTypeOf<true>();
expectTypeOf<Xor<false, false>>().toEqualTypeOf<false>();
expectTypeOf<Xor<boolean, boolean>>().toEqualTypeOf<boolean>();

// ── De Morgan sanity check: Not<And<A,B>> == Or<Not<A>, Not<B>> ───────────
expectTypeOf<Not<And<true, false>>>().toEqualTypeOf<Or<Not<true>, Not<false>>>();

// ── Gates compose: Or<And<…>, And<…>> over concrete inputs ────────────────
// (true AND true) OR (false AND true) → true OR false → true
expectTypeOf<Or<And<true, true>, And<false, true>>>().toEqualTypeOf<true>();
