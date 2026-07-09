/**
 * SOLUTION — DeepPartial<T>
 *
 * `Partial<T>` makes the top-level keys optional; nested objects stay
 * required. `DeepPartial<T>` makes EVERY key optional at EVERY depth — the
 * shape you want for "patch" objects, optional config, or a recursive form
 * helper.
 *
 * Same skeleton as `DeepReadonly` (Topic 38-01), but the modifier we apply is
 * `?` (optionality) instead of `readonly` (immutability), and we recurse on
 * the value type:
 *
 *     type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };
 *
 * Termination rules carry over:
 *   - Functions short-circuit (a function is structurally an object, but
 *     mapping over its keys would destroy the call signature).
 *   - Primitives have no own keys, so the `T extends object` guard passes
 *     them through — but because the mapped type is homomorphic-ish over
 *     `keyof T`, a primitive lands in the final `: T` branch unchanged.
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation:
//   1. function?  → return as-is (same guard as DeepReadonly).
//   2. array?     → return as-is. We deliberately do NOT make each element
//      optional (that would turn `number[]` into `(number | undefined)[]`,
//      which is a different, misleading type). For a "patch" object the whole
//      array is optional at its PARENT key; its elements stay as they were.
//   3. object?    → every key becomes optional, and the VALUE type is itself
//      DeepPartial — so optionality cascades down the tree.
//   4. primitive  → returned unchanged (the base case that stops recursion).
type DeepPartial<T> = T extends (...args: any[]) => unknown
  ? T
  : T extends readonly unknown[]
    ? T
    : T extends object
      ? { [K in keyof T]?: DeepPartial<T[K]> }
      : T;

// A tree with two levels of nesting plus a function.
type Config = {
  env: string;
  db: { host: string; port: number; ssl: { ca: string; rejectUnauthorized: boolean } };
  onBoot: () => void;
};

type PartialConfig = DeepPartial<Config>;

// CHECKS — every property at every level is now optional, and the function
// stays exactly `() => void` (NOT `(() => void) | undefined` from being
// recursed into, and NOT mangled from being mapped over).

expectTypeOf<PartialConfig>().toEqualTypeOf<{
  env?: string;
  db?: {
    host?: string;
    port?: number;
    ssl?: { ca?: string; rejectUnauthorized?: boolean };
  };
  onBoot?: () => void;
}>();

// The deeply-nested ssl object is itself partial-at-every-level:
expectTypeOf<NonNullable<PartialConfig["db"]>>().toEqualTypeOf<{
  host?: string;
  port?: number;
  ssl?: { ca?: string; rejectUnauthorized?: boolean };
}>();

// The function value type is unchanged when present:
expectTypeOf<NonNullable<PartialConfig["onBoot"]>>().toEqualTypeOf<() => void>();

// Primitives pass through (base case):
expectTypeOf<DeepPartial<number>>().toEqualTypeOf<number>();

// DeepPartial of an array element type: applying to number[] yields an array
// whose element type DeepPartial<number> === number, so the array is unchanged:
expectTypeOf<DeepPartial<number[]>>().toEqualTypeOf<number[]>();

// RUNTIME — every level genuinely accepts `undefined`/is skippable. This is
// the runtime payoff of the type: a totally-empty patch object is valid.
describe("02-deep-partial runtime checks", () => {
  // The empty object is a valid DeepPartial<Config>:
  const empty: PartialConfig = {};
  assert(Object.keys(empty).length === 0, "empty patch is allowed");

  // A partially-specified patch at depth 2 is also valid:
  const patch: PartialConfig = {
    db: { ssl: { rejectUnauthorized: false } },
  };
  assert(patch.db?.ssl?.rejectUnauthorized === false, "deep patch reads back");

  // A function, if supplied, must keep its original signature:
  const withFn: PartialConfig = { onBoot: () => {} };
  withFn.onBoot?.();
});
