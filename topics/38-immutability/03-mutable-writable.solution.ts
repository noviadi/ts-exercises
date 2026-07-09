/**
 * SOLUTION — Mutable<T> / Writable<T> and DeepMutable<T>
 *
 * The inverse direction of `Readonly<T>`: strip `readonly` off every key.
 * Built with the `-readonly` mapped-type modifier (Topic 11) — the minus
 * sign is what does the removing; without it a homomorphic mapped type
 * PRESERVES the modifier instead.
 *
 *     type Mutable<T> = { -readonly [K in keyof T]: T[K] };
 *                            ^^^^^^^^
 *                            "remove readonly"
 *
 * `Writable<T>` is just the conventional alias used in utility libs
 * (type-fest, utility-types, …). They are identical.
 *
 * For the deep variant we reuse the recursive skeleton from 38-01/02, but
 * apply `-readonly` (and keep the function short-circuit — see below for
 * WHY that matters even when removing modifiers).
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation: `-readonly` strips the readonly modifier from every key. This
// is the canonical definition used by every "Mutable/Writable" utility.
type Mutable<T> = { -readonly [K in keyof T]: T[K] };

// explanation: `Writable` is the same thing under a different name — both
// spellings circulate in popular utility libraries. An alias makes the
// intent readable for both audiences.
type Writable<T> = Mutable<T>;

// explanation: the deep variant. Same termination rules as DeepReadonly:
//   - functions short-circuit (mapping over a function's keys breaks it),
//   - arrays/tuples get their own branch so a readonly tuple maps back to a
//     fixed-length MUTABLE tuple (rather than collapsing),
//   - objects get `-readonly` recursively,
//   - primitives pass through.
type DeepMutable<T> = T extends (...args: any[]) => unknown
  ? T
  : T extends readonly unknown[]
    ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
    : T extends object
      ? { -readonly [K in keyof T]: DeepMutable<T[K]> }
      : T;

// A config that is frozen at every depth (e.g. produced by `as const` or
// DeepReadonly). We want to thaw the whole thing.
type Frozen = {
  readonly env: string;
  readonly nested: { readonly port: number; readonly flags: { readonly debug: boolean } };
  readonly tuple: readonly [number, string];
  readonly list: readonly number[];
  readonly run: () => void;
};

type Thawed = DeepMutable<Frozen>;

// CHECKS — every `readonly` is gone, at every level; the tuple is a mutable
// tuple (length preserved); the function keeps its original signature.

expectTypeOf<Thawed>().toEqualTypeOf<{
  env: string;
  nested: { port: number; flags: { debug: boolean } };
  tuple: [number, string];
  list: number[];
  run: () => void;
}>();

// Shallow Mutable/Writable: only the top-level keys are thawed (note that
// `nested` is STILL `readonly port` — shallow, like Readonly<T> is shallow).
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

// Mutable and Writable are the same type:
expectTypeOf<Mutable<Frozen>>().toEqualTypeOf<Writable<Frozen>>();

// The deep flags object is fully thawed:
expectTypeOf<Thawed["nested"]["flags"]>().toEqualTypeOf<{ debug: boolean }>();

// Readonly tuple → mutable tuple (length kept):
expectTypeOf<Thawed["tuple"]>().toEqualTypeOf<[number, string]>();

// Function survives the recursion intact (NOT a mangled mapped object):
expectTypeOf<Thawed["run"]>().toEqualTypeOf<() => void>();
expectTypeOf<Thawed["run"]>().toBeCallableWith();

// RUNTIME — once thawed, every previously-readonly field is assignable.
describe("03-mutable-writable runtime checks", () => {
  const thawed: Thawed = {
    env: "prod",
    nested: { port: 8080, flags: { debug: true } },
    tuple: [1, "a"],
    list: [1, 2, 3],
    run: () => {},
  };

  // These writes would be TYPE ERRORS on `Frozen`. Thawing makes them legal.
  thawed.env = "dev";
  thawed.nested.flags.debug = false;
  thawed.tuple[0] = 99;
  thawed.list.push(4);

  assert(thawed.env === "dev", "top-level write");
  assert(thawed.nested.flags.debug === false, "deep write");
  assert(thawed.tuple[0] === 99, "tuple element write");
  assert(thawed.list.length === 4, "array mutation");

  // Contrast: the frozen original rejects writes (kept as a teaching error).
  const frozen: Frozen = thawed;
  // @ts-expect-error  Cannot assign to 'env' because it is a read-only property.
  frozen.env = "x";
});
