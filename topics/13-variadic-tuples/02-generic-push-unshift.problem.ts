/**
 * PROMPT — Type `push` and `unshift` with the `readonly unknown[]` constraint
 *
 * Now we use the variadic spread to add a SINGLE element to either end of a
 * generic tuple — the type-level equivalent of `Array.prototype.push` and
 * `Array.prototype.unshift`, but returning a *new* tuple with exact length.
 *
 * Your job:
 *   1. Implement `Push<T, V>`   — append `V` to the end of tuple `T`.
 *   2. Implement `Unshift<T, V>` — prepend `V` to the start of tuple `T`.
 *
 *   T must be constrained to `readonly unknown[]` (so callers can pass `as
 *   const` tuples), and the result should be a fresh MUTABLE tuple.
 *
 * Run:  npx tsc --noEmit 02-generic-push-unshift.problem.ts
 */

// TODO: implement.
type Push<T extends readonly unknown[], V> = any;
type Unshift<T extends readonly unknown[], V> = any;

import { expectTypeOf } from "@lib";

// CHECKS — fail until implemented.

expectTypeOf<Push<[1, 2], 3>>().toEqualTypeOf<[1, 2, 3]>();
expectTypeOf<Push<[], "x">>().toEqualTypeOf<["x"]>();

expectTypeOf<Unshift<[2, 3], 1>>().toEqualTypeOf<[1, 2, 3]>();
expectTypeOf<Unshift<[], 0>>().toEqualTypeOf<[0]>();

// Pushing onto a readonly input should still yield a mutable tuple:
expectTypeOf<Push<readonly ["a"], "b">>().toEqualTypeOf<["a", "b"]>();
