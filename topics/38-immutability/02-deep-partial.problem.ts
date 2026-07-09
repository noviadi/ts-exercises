/**
 * PROMPT — DeepPartial<T>
 *
 * `Partial<T>` only optionallises the top level. Write a RECURSIVE
 * `DeepPartial<T>` that makes EVERY key optional at EVERY depth — the shape
 * of a deep merge/patch object.
 *
 * Rules:
 *   - Functions must be passed through unchanged (same trap as DeepReadonly:
 *     a function is structurally an object, and mapping over its keys
 *     destroys the call signature).
 *   - Primitives are the base case.
 *
 *     type DeepPartial<T> = any;   // TODO: replace
 *
 * Hint: mirror the structure of `DeepReadonly` from 38-01, but use the `?`
 * modifier instead of `readonly`, and recurse on the value type.
 *
 * Run:  npx tsc --noEmit 02-deep-partial.problem.ts
 */

import { expectTypeOf } from "@lib";

// TODO: implement DeepPartial<T>.
type DeepPartial<T> = any;

type Config = {
  env: string;
  db: { host: string; port: number; ssl: { ca: string; rejectUnauthorized: boolean } };
  onBoot: () => void;
};

// CHECKS — these FAIL until your DeepPartial is correct.

expectTypeOf<DeepPartial<Config>>().toEqualTypeOf<{
  env?: string;
  db?: {
    host?: string;
    port?: number;
    ssl?: { ca?: string; rejectUnauthorized?: boolean };
  };
  onBoot?: () => void;
}>();

expectTypeOf<DeepPartial<number>>().toEqualTypeOf<number>();
