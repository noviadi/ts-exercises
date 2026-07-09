/**
 * PROMPT — DeepReadonly<T>
 *
 * The built-in `Readonly<T>` only freezes the TOP level:
 *
 *     type Config = { nested: { port: number } };
 *     type R = Readonly<Config>;          // `nested` is still mutable!
 *     const c: R = { nested: { port: 80 } };
 *     c.nested.port = 81;                 // 😱 compiles — not deep
 *
 * Your job: write `DeepReadonly<T>` — a RECURSIVE mapped type that freezes
 * every level of nesting, AND correctly handles:
 *   - arrays & tuples (become `readonly …[]` / `readonly […]`),
 *   - functions (left AS-IS — recursing into a function corrupts it),
 *   - primitives (base case: pass through unchanged).
 *
 * Implementation skeleton (fill the body of `DeepReadonly`):
 *
 *     type DeepReadonly<T> = any;   // TODO: replace
 *
 * Hint: use a chain of conditional types. Order matters — short-circuit
 * functions and arrays BEFORE the generic `T extends object` branch.
 *
 * Run:  npx tsc --noEmit 01-deep-readonly.problem.ts
 */

import { expectTypeOf } from "@lib";

// TODO: implement DeepReadonly<T>.
type DeepReadonly<T> = any;

type Config = {
  env: string;
  nested: { port: number; flags: { debug: boolean } };
  tuple: [number, string];
  list: number[];
  run: () => void;
};

// CHECKS — these FAIL until your DeepReadonly is correct.

expectTypeOf<DeepReadonly<Config>>().toEqualTypeOf<{
  readonly env: string;
  readonly nested: {
    readonly port: number;
    readonly flags: { readonly debug: boolean };
  };
  readonly tuple: readonly [number, string];
  readonly list: readonly number[];
  readonly run: () => void;
}>();

expectTypeOf<DeepReadonly<Config>["nested"]["flags"]>().toEqualTypeOf<{
  readonly debug: boolean;
}>();

expectTypeOf<DeepReadonly<string>>().toEqualTypeOf<string>();
