/**
 * SOLUTION — Get<T, "a.b.c">: type-safe dot-path navigation
 *
 * The whole trick is splitting a string literal on the FIRST `.` and recursing.
 *
 *   P extends `${infer Head}.${infer Tail}`
 *
 * Template-literal `infer` is greedy on the *surrounding* patterns but, for the
 * two placeholders here, TS binds `Head` to everything up to the FIRST `.` and
 * `Tail` to the rest. (It does NOT split on every dot at once — that's why we
 * recurse.)
 *
 * The conditional then has two branches:
 *
 *   1. SPLIT branch — there is at least one dot:
 *        - If `Head extends keyof T`, the head is a real key: recurse with
 *          `Get<T[Head], Tail>` (narrow into the nested object).
 *        - Else the head is unknown: bail to `undefined`.
 *
 *   2. NO-DOT branch — `P` is the final segment:
 *        - If `P extends keyof T`, return `T[P]`.
 *        - Else return `undefined`.
 *
 * Recursion bottoms out at the no-dot base case. Depth is bounded by the number
 * of dots in the path, so this never threatens the recursion limit for any
 * realistic object.
 *
 * Design choice: invalid paths yield `undefined` (not `never`). This mirrors how
 * a runtime `lodash.get(obj, "missing")` returns `undefined`, and it composes
 * safely with optional chaining at the call site.
 */

import { assert, describe, expectTypeOf } from "@lib";

export type Get<T, P extends string> = P extends `${infer Head}.${infer Tail}`
  ? Head extends keyof T
    ? Get<T[Head], Tail>
    : undefined
  : P extends keyof T
    ? T[P]
    : undefined;

// ── Test fixtures ───────────────────────────────────────────────────────────
type Config = {
  host: string;
  port: number;
  db: { url: string; pool: { size: number; timeout: number } };
};

// CHECKS — compile-time.
expectTypeOf<Get<Config, "host">>().toEqualTypeOf<string>();
expectTypeOf<Get<Config, "db.url">>().toEqualTypeOf<string>();
expectTypeOf<Get<Config, "db.pool.size">>().toEqualTypeOf<number>();
expectTypeOf<Get<Config, "db.pool.timeout">>().toEqualTypeOf<number>();

// Invalid paths → undefined (mirrors lodash.get).
expectTypeOf<Get<Config, "missing">>().toEqualTypeOf<undefined>();
expectTypeOf<Get<Config, "db.missing.deep">>().toEqualTypeOf<undefined>();

// A literal value is preserved exactly (Get is precise, not widening).
type Exact = { a: { b: { c: 42 } } };
expectTypeOf<Get<Exact, "a.b.c">>().toEqualTypeOf<42>();

// ── A typed runtime `get` that mirrors `Get` ─────────────────────────────────
// We constrain the path with `Paths`-style narrowing inline: any string is
// accepted at runtime, but the return type is computed by `Get<T, P>`.
function get<T extends Record<string, unknown>, P extends string>(
  obj: T,
  path: P,
): Get<T, P> {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const part of parts) {
    // explanation: each step is a runtime narrowing we cannot prove at compile
    // time, so we cast through `unknown`. The TYPE of the result is still
    // exactly `Get<T, P>` — the cast only bridges the value/type gap.
    cur =
      cur && typeof cur === "object" && part in cur
        ? (cur as Record<string, unknown>)[part]
        : undefined;
  }
  return cur as Get<T, P>;
}

describe("01-get-by-path runtime checks", () => {
  const cfg: Config = {
    host: "localhost",
    port: 5432,
    db: { url: "postgres://x", pool: { size: 10, timeout: 3000 } },
  };

  assert(get(cfg, "host") === "localhost", "shallow path");
  assert(get(cfg, "db.url") === "postgres://x", "nested path");
  assert(get(cfg, "db.pool.size") === 10, "deep path");

  // Invalid paths return undefined at runtime too.
  assert(get(cfg, "missing") === undefined, "missing key → undefined");
  assert(get(cfg, "db.missing.deep") === undefined, "deep miss → undefined");
});
