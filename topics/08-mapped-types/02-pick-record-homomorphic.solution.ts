/**
 * SOLUTION — Rebuild `Pick` and `Record`, and observe homomorphism
 *
 *   type MyPick<T, K extends keyof T>      = { [P in K]: T[P] };
 *   type MyRecord<K extends keyof any, V>  = { [P in K]: V };
 *
 * Why these are the canonical definitions:
 *
 *   • `Pick` — iterate the *requested* keys `K` (which are guaranteed to be
 *     keys of `T` because `K extends keyof T`). For each key `P`, look up the
 *     original value type with `T[P]`. That's all `Pick` does.
 *
 *   • `Record` — iterate the keys `K`, but instead of looking up a value type,
 *     slam `V` in for every one. `keyof any` (= `string | number | symbol`)
 *     is the widest possible key set, so any key union is allowed.
 *
 * ── Homomorphic mapped types ────────────────────────────────────────────────
 *
 * A mapped type is **homomorphic** when TS can tell it is "shaped after" some
 * other object type `T`. The recogniser is the iteration clause:
 *
 *   • `{ [K in keyof T]: ... }`                    — homomorphic in T
 *   • `{ [P in K]: ... }` where `K extends keyof T` — ALSO homomorphic in T
 *
 * When the recogniser fires, the result *inherits* the modifiers (`readonly`,
 * `?`) of the original properties of `T` — even though our syntax doesn't
 * mention them. This is why `Pick<Optional, "a">` keeps `a?` optional.
 *
 * `Record<K, V>` is the textbook NON-homorphic case: `K` is just a union of
 * strings, with no original object to inherit modifiers from, so the result is
 * always plain (non-readonly, non-optional) keys.
 */

type Config = { retries: number; timeout: number; host: string };
type Optional = { a?: string; b: number };

// explanation: iterate only the requested keys; for each, project the original
// value type out of T via indexed access `T[P]`.
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };

// explanation: no `T` involved at all — every key in K gets the same value
// type V. `keyof any` is the constraint (string | number | symbol).
type MyRecord<K extends keyof any, V> = { [P in K]: V };

import { assert, describe, assertEquals, expectTypeOf } from "@lib";

// CHECKS — compile-time.

// Pick keeps only the requested keys with their original value types:
expectTypeOf<MyPick<Config, "retries" | "timeout">>().toEqualTypeOf<{
  retries: number;
  timeout: number;
}>();

// Record maps every key in the union to V:
expectTypeOf<MyRecord<"a" | "b", number>>().toEqualTypeOf<{ a: number; b: number }>();

// ── The homomorphic property ────────────────────────────────────────────────
// MyPick<Optional, "a"> keeps the `?` — TS recognises the `[P in K]` (where
// K extends keyof T) shape and carries the optionality through.
expectTypeOf<MyPick<Optional, "a">>().toEqualTypeOf<{ a?: string }>();
expectTypeOf<MyPick<Optional, "a" | "b">>().toEqualTypeOf<{ a?: string; b: number }>();

// Contrast: Record is NOT homomorphic. Even if we constructed an "optional"
// looking union, Record has no source object to copy modifiers from, so the
// result is always plain. (No assertion to make here — just the contrast.)

// RUNTIME — a tiny `pick` that mirrors MyPick at the value level, so we can
// actually exercise the behaviour.
function pick<T, K extends keyof T>(obj: T, ...keys: K[]): MyPick<T, K> {
  const out = {} as MyPick<T, K>;
  for (const k of keys) {
    // assignment is safe because out has exactly the keys in K with T[K] types
    (out as Record<K, T[K]>)[k] = obj[k];
  }
  return out;
}

describe("02-pick-record-homomorphic runtime checks", () => {
  const cfg: Config = { retries: 3, timeout: 1000, host: "localhost" };
  const subset = pick(cfg, "retries", "timeout");

  // The runtime object literally only has the picked keys:
  assertEquals(
    { retries: subset.retries, timeout: subset.timeout },
    { retries: 3, timeout: 1000 },
  );

  // Record as a lookup table:
  const codes: MyRecord<"ok" | "err", number> = { ok: 200, err: 500 };
  assert(codes.ok === 200 && codes.err === 500, "record values are present");

  // MyPick preserves optionality at runtime too — picking `a` from an
  // Optional gives us an object that may legitimately lack `a`.
  const opt: Optional = { b: 7 };
  const picked = pick(opt, "a") as { a?: string };
  assert(picked.a === undefined, "optional field correctly absent");
});
