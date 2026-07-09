/**
 * SOLUTION — Paths<T>: enumerate every valid dotted path
 *
 * The shape of the solution is a recursive walk that, for each string key K of
 * T, contributes two path strings to the result:
 *
 *   1. `"K"`                — the key itself (a path of length 1)
 *   2. `"K." + Paths<T[K]>` — every path inside the value, prefixed with `K.`
 *
 * The base case hides in (2): when `T[K]` is a primitive (string, number, …),
 * `Paths<T[K]>` returns `never`. Template literals eat `never` —
 * `"K.${never}"` collapses to `never` — so the dotted branch simply vanishes
 * and only `"K"` is left. No explicit `is object?` test is needed for the
 * leaves: `never` does the work.
 *
 * ── Flattening per-key results into a union ────────────────────────────────
 *
 * `Paths` returns a *union*, not an object. The idiom:
 *
 *   { [K in keyof T & string]: K | `${K}.${Paths<T[K]>}` }[keyof T & string]
 *       \___________________________ object _______________________________/
 *        \____ value per key ____ /                                  \ index /
 *
 * Build a mapped object whose property VALUES are path unions, then immediately
 * index it by `[keyof T & string]` to project out the union of all values. This
 * is the standard "homomorphic-map then index" flatten.
 *
 * ── Why exclude arrays? ──────────────────────────────────────────────────────
 *
 * Arrays are objects (keys "0","1",…, plus "length", "push", …). Indexing into
 * them by `"0"` is technically valid but rarely what you want from a dot-path
 * API, and enumerating every numeric index of `unknown[]` is meaningless
 * (`keyof unknown[]` includes `number`). So we return `never` for arrays and
 * don't descend — keeping the path set clean. (Relax this if your domain wants
 * `arr.0.prop` paths.)
 *
 * ── Recursion depth ──────────────────────────────────────────────────────────
 *
 * Depth here is the depth of the *object tree*, not the path length, so it is
 * almost always small. For pathologically deep shapes you can add a depth
 * accumulator (a tuple that grows each recursion and stops at a fixed length)
 * — see Topic 41's recursion-limit discussion.
 */

import { assert, describe, expectTypeOf } from "@lib";

type Paths<T> = T extends readonly unknown[]
  ? never // arrays: don't descend
  : T extends object
    ? {
        [K in keyof T & string]: K | `${K}.${Paths<T[K]>}`;
      }[keyof T & string]
    : never; // primitive leaf → base case

// ── Fixtures ────────────────────────────────────────────────────────────────
type Cfg = { a: { b: { c: 1 }; d: 2 }; e: 3 };
type WithArray = { list: string[]; name: string };

// CHECKS — compile-time.
expectTypeOf<Paths<Cfg>>().toEqualTypeOf<
  "a" | "a.b" | "a.b.c" | "a.d" | "e"
>();

// Arrays contribute their key but no descendant paths (we don't descend).
expectTypeOf<Paths<WithArray>>().toEqualTypeOf<"list" | "name">();

// A single-level object: just the keys, no dots.
expectTypeOf<Paths<{ x: 1; y: 2 }>>().toEqualTypeOf<"x" | "y">();

// ── Composing Paths with Get (from 01) ───────────────────────────────────────
// Paths<T> is the set of valid inputs to Get<T, _>. Use it to constrain a
// type-safe `get` so only real paths compile.
import type { Get } from "./01-get-by-path.solution";

type Exact = { a: { b: { c: 42 } } };
expectTypeOf<Get<Exact, "a.b.c">>().toEqualTypeOf<42>();

function getPath<T extends Record<string, unknown>, P extends Paths<T> & string>(
  obj: T,
  path: P,
): Get<T, P> {
  // Delegates to the same runtime walker as 01; the type-level contract is
  // what's new: `path` must be a member of `Paths<T>`.
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const part of parts) {
    cur =
      cur && typeof cur === "object" && part in cur
        ? (cur as Record<string, unknown>)[part]
        : undefined;
  }
  return cur as Get<T, P>;
}

describe("02-paths-union runtime checks", () => {
  const cfg: Cfg = { a: { b: { c: 1 }, d: 2 }, e: 3 };

  assert(getPath(cfg, "a.b.c") === 1, "deep valid path");
  assert(getPath(cfg, "e") === 3, "shallow valid path");
  assert(getPath(cfg, "a.d") === 2, "mid-depth valid path");

  // Paths<WithArray> excludes array descendants, but "list" itself is valid.
  const wa: WithArray = { list: ["x", "y"], name: "n" };
  assert(getPath(wa, "name") === "n", "array-bearing object: sibling key ok");

  // A typo is now a COMPILE error, not a silent runtime undefined:
  // @ts-expect-error  "a.b.x" is not a member of Paths<Cfg> → rejected.
  void getPath(cfg, "a.b.x");
});
