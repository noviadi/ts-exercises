/**
 * PROMPT — Prefix + suffix composition, and the "one generic middle spread" rule
 *
 * Variadic tuples also let you sandwich a generic middle between concrete
 * ends: `[A, ...T, B]`. This is the type-level pattern for things like
 * "function-call argument list with a known first arg and known last arg,
 * anything in between".
 *
 * Your job:
 *   1. Implement `Sandwich<P, M, S>` — splice a prefix `P`, middle `M`, then
 *      suffix `S`.  (Three generic spreads — fine, because none of them is
 *      an "unknown-length middle" — they're all concrete-at-the-call-site.)
 *   2. Implement `WithBoundary<T>` — prepend `0` and append `99` to any tuple.
 *
 * Run:  npx tsc --noEmit 03-prefix-suffix-composition.problem.ts
 */

// TODO: implement.
type Sandwich<
  P extends readonly unknown[],
  M extends readonly unknown[],
  S extends readonly unknown[],
> = any;

type WithBoundary<T extends readonly unknown[]> = any;

import { expectTypeOf } from "@lib";

// CHECKS — fail until implemented.

expectTypeOf<Sandwich<[1], [2, 3], [4]>>().toEqualTypeOf<[1, 2, 3, 4]>();
expectTypeOf<Sandwich<[], [1, 2], []>>().toEqualTypeOf<[1, 2]>();

expectTypeOf<WithBoundary<[5, 6]>>().toEqualTypeOf<[0, 5, 6, 99]>();
expectTypeOf<WithBoundary<[]>>().toEqualTypeOf<[0, 99]>();
