/**
 * PROMPT — Keys<T> and Values<T> as literal tuples
 *
 * In `01` we went tuple → object. Now invert it: pull a tuple's *keys* and
 * *values* back out, but as **literal tuples** (ordered, fixed-length) — NOT as
 * the unions that `keyof T` / `T[number]` give you.
 *
 *   type Keys<T>   = ["0", "1", "2"]   // the index keys, in order
 *   type Values<T> = [A, B, C]          // the element types, in order
 *
 * The mechanism: a **homomorphic mapped type** `{ [K in keyof T]: ... }` over a
 * *tuple* yields another *tuple* of the same length (TS recognises the shape and
 * maps element-wise). That is the key insight — the same syntax that maps an
 * object's properties maps a tuple's positions.
 *
 * Contrast with the unions:
 *   `keyof T`      → "0" | "1" | "2"           (a union, unordered)
 *   `T[number]`    → A | B | C                  (a union, unordered)
 *
 * Your job: implement `Keys` and `Values`, then make the CHECKS compile.
 *
 * Rule: keep them `readonly`-preserving (input `readonly` → output `readonly`).
 *
 * Run:  npx tsc --noEmit 02-keys-values.problem.ts
 */

import { expectTypeOf } from "@lib";

// TODO: implement.
type Keys<T extends readonly unknown[]> = TODO;
type Values<T extends readonly unknown[]> = TODO;

// CHECKS — make these compile.
type Tuple = readonly [string, number, boolean];

expectTypeOf<Keys<Tuple>>().toEqualTypeOf<readonly ["0", "1", "2"]>();
expectTypeOf<Values<Tuple>>().toEqualTypeOf<readonly [string, number, boolean]>();

// Contrast with the unions (these are NOT tuples). `Tuple[number]` is the union
// of element types; `keyof Tuple` is wider than just the index strings (it also
// includes Array prototype members), so `Keys<T>` above is the clean form.
expectTypeOf<Tuple[number]>().toEqualTypeOf<string | number | boolean>();
