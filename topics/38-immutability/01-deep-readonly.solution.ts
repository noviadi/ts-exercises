/**
 * SOLUTION — DeepReadonly<T>
 *
 * The built-in `Readonly<T>` is a *shallow* mapped type:
 *
 *     type Readonly<T> = { readonly [K in keyof T]: T[K] };
 *
 * It stamps `readonly` on the top-level keys only — nested objects stay
 * mutable. To freeze the WHOLE tree we make the mapped type **recursive**:
 * the body calls the type itself on each property value.
 *
 *     type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> };
 *                                  ^^^^^^^^^^^^^                  ^^^^^^^^^^
 *                                  loop                            recurse!
 *
 * Termination is critical: every recursive type needs base cases.
 *   - Primitives (`string`, `number`, …) and `null`/`undefined` have no
 *     `keyof`, so the mapped type's `T extends object` guard passes them
 *     through untouched — that is our base case.
 *   - Functions: a function technically IS an object (`keyof (() => void)`
 *     includes `"call"`, `"apply"`, …). If we recursed into it, the mapped
 *     type would produce a broken callable-shaped object. So we MUST
 *     short-circuit functions before the object branch.
 *   - Arrays/tuples: handled by the `T extends readonly unknown[]` branch.
 *     We give it its own case (rather than letting it fall through to the
 *     generic object branch) so the `readonly` modifier is applied in a way
 *     TS recognises as a `readonly` array, and tuples keep their length.
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation: the order of these conditional branches matters.
//   1. function?  → return as-is (do NOT recurse: a function is technically an
//      object, but mapping over its keys destroys its call signature).
//   2. array/tuple? → map with `readonly`, preserving length & element order.
//   3. plain object? → map every key to DeepReadonly of its value.
//   4. anything else (primitive, null, undefined) → returned unchanged.
type DeepReadonly<T> = T extends (...args: any[]) => unknown
  ? T
  : T extends readonly unknown[]
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T extends object
      ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
      : T;

// A deeply-nested config that mixes objects, a tuple, an array, and a function.
type Config = {
  env: string;
  nested: { port: number; flags: { debug: boolean } };
  tuple: [number, string];
  list: number[];
  run: () => void;
};

// explanation: applying DeepReadonly freezes every level AND every array/
// tuple. The function (`run`) is passed through untouched because of branch 1.
type FrozenConfig = DeepReadonly<Config>;

// CHECKS — every property at every depth is now `readonly`, arrays/tuples are
// `readonly`, and the function keeps its original call signature.

expectTypeOf<FrozenConfig>().toEqualTypeOf<{
  readonly env: string;
  readonly nested: {
    readonly port: number;
    readonly flags: { readonly debug: boolean };
  };
  readonly tuple: readonly [number, string];
  readonly list: readonly number[];
  readonly run: () => void;
}>();

// The nested flags object is frozen too — this is the whole point vs Readonly<T>:
expectTypeOf<DeepReadonly<Config>["nested"]["flags"]>().toEqualTypeOf<{
  readonly debug: boolean;
}>();

// Tuples keep their length & element types, but become readonly:
expectTypeOf<DeepReadonly<Config>["tuple"]>().toEqualTypeOf<
  readonly [number, string]
>();

// Arrays become `readonly number[]` (not a tuple, not a broken object):
expectTypeOf<DeepReadonly<Config>["list"]>().toEqualTypeOf<readonly number[]>();

// Functions are NOT mangled — they stay callable with the original signature:
expectTypeOf<DeepReadonly<Config>["run"]>().toEqualTypeOf<() => void>();
expectTypeOf<DeepReadonly<Config>["run"]>().toBeCallableWith();

// Primitives pass straight through (the base case):
expectTypeOf<DeepReadonly<string>>().toEqualTypeOf<string>();
expectTypeOf<DeepReadonly<42>>().toEqualTypeOf<42>();

// RUNTIME — prove the immutability the type promises. The TS error below (kept
// via @ts-expect-error) is exactly the protection DeepReadonly gives you; at
// runtime we just confirm the value still works for reads.
describe("01-deep-readonly runtime checks", () => {
  const config: FrozenConfig = {
    env: "prod",
    nested: { port: 8080, flags: { debug: true } },
    tuple: [1, "a"],
    list: [1, 2, 3],
    run: () => {},
  };

  assert(config.nested.flags.debug === true, "deep read still works");
  assert(config.tuple[0] === 1, "tuple element readable");
  assert(config.list.length === 3, "array length readable");
  config.run();

  // @ts-expect-error  Cannot assign to 'debug' because it is a read-only property (DeepReadonly).
  config.nested.flags.debug = false;
});
