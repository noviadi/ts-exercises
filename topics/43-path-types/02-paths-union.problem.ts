/**
 * PROMPT — Paths<T>: enumerate every valid dotted path
 *
 * `Get` (previous exercise) navigates ONE path. Now invert it: produce the
 * UNION of every dotted-path string literal that exists in `T`.
 *
 *   type Cfg = { a: { b: 1; c: 2 }; d: 3 };
 *   Paths<Cfg>  →  "a" | "a.b" | "a.c" | "d"
 *
 * Mechanism:
 *
 *   - Walk each string key `K` of `T`.
 *   - For each, emit `"K"` AND `"K." + Paths<T[K]>` (recurse into the value).
 *   - When `T[K]` is a primitive, `Paths<T[K]>` returns `never`, which
 *     collapses `"K.${never}"` to `never` — so the dot branch vanishes and only
 *     `"K"` remains. That is the base case.
 *
 * To turn a per-key mapped object into a single UNION of values, use the
 * mapped-type-then-index trick:
 *
 *   { [K in keyof T & string]: ... }[keyof T & string]
 *
 * (build an object mapping each key to its paths, then index back out by all
 * keys to flatten into a union).
 *
 * Your job: implement `Paths<T>` so the CHECKS compile.
 *
 * Hint: exclude arrays (don't descend into them) by returning `never` when
 * `T extends readonly unknown[]`.
 *
 * Run:  npx tsc --noEmit 02-paths-union.problem.ts
 */

import { expectTypeOf } from "@lib";

// TODO: implement.
type Paths<T> = TODO;

// CHECKS — make these compile.
type Cfg = { a: { b: { c: 1 }; d: 2 }; e: 3 };

expectTypeOf<Paths<Cfg>>().toEqualTypeOf<
  "a" | "a.b" | "a.b.c" | "a.d" | "e"
>();
