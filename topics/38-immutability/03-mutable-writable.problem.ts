/**
 * PROMPT — Mutable<T> / Writable<T> and DeepMutable<T>
 *
 * Implement the INVERSE of `Readonly<T>` / `DeepReadonly<T>`: strip
 * `readonly` from every key.
 *
 *   1. Shallow `Mutable<T>` (a.k.a. `Writable<T>`) — strip `readonly` off the
 *      top level only. Use the `-readonly` mapped-type modifier.
 *   2. Deep `DeepMutable<T>` — strip `readonly` recursively, at every depth.
 *
 * Rules for the deep variant (same traps as DeepReadonly):
 *   - Functions must pass through unchanged.
 *   - A readonly tuple should map back to a MUTABLE tuple of the same length.
 *   - Primitives are the base case.
 *
 *     type Mutable<T> = any;       // TODO: replace
 *     type DeepMutable<T> = any;   // TODO: replace
 *
 * Run:  npx tsc --noEmit 03-mutable-writable.problem.ts
 */

import { expectTypeOf } from "@lib";

// TODO: implement Mutable<T>, Writable<T> (= Mutable), and DeepMutable<T>.
type Mutable<T> = any;
type DeepMutable<T> = any;

type Frozen = {
  readonly env: string;
  readonly nested: { readonly port: number; readonly flags: { readonly debug: boolean } };
  readonly tuple: readonly [number, string];
  readonly list: readonly number[];
  readonly run: () => void;
};

// CHECKS — these FAIL until your implementations are correct.

expectTypeOf<DeepMutable<Frozen>>().toEqualTypeOf<{
  env: string;
  nested: { port: number; flags: { debug: boolean } };
  tuple: [number, string];
  list: number[];
  run: () => void;
}>();

expectTypeOf<Mutable<Frozen>>().toEqualTypeOf<{
  env: string;
  nested: {
    readonly port: number;
    readonly flags: { readonly debug: boolean };
  };
  tuple: readonly [number, string];
  list: readonly number[];
  run: () => void;
}>();
