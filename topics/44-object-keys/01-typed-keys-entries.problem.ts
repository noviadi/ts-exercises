/**
 * PROMPT — The `Object.keys` unsoundness, and typed `keys` / `entries`
 *
 * `Object.keys` is declared as `(o: object) => string[]` — it deliberately
 * does NOT return `(keyof T)[]`. Below, the built-ins throw away everything we
 * know about `config`. Your job is to write typed wrappers that restore the key
 * set and the value types, AND to understand exactly which cast is honest.
 *
 * Rules:
 *   - Do not change `Config` or `config`.
 *   - Implement `keys` and `entries` so the CHECKS compile.
 *   - Read the runtime `describe` block: it proves the casts are honest for a
 *     plain object (every value really is one of the declared types).
 *
 * Run:  npx tsc --noEmit 01-typed-keys-entries.problem.ts
 */

import { describe, assert, expectTypeOf } from "@lib";

type Config = { host: string; port: number; tls: boolean };
const config: Config = { host: "localhost", port: 8080, tls: true };

// The built-ins — both lose precision:
const builtinKeys = Object.keys(config); // string[]
const builtinEntries = Object.entries(config); // [string, any][]

// TODO: implement `keys` so it returns `Array<keyof T>`.
function keys<T extends object>(obj: T): TODO {
  return Object.keys(obj) as TODO;
}

// TODO: implement `entries` so each pair is `[keyof T, T[keyof T]]`.
function entries<T extends object>(obj: T): TODO {
  return Object.entries(obj) as TODO;
}

// CHECKS — fail until you fill in the TODOs.
const k = keys(config);
expectTypeOf<typeof k>().toEqualTypeOf<Array<"host" | "port" | "tls">>();

const e = entries(config);
expectTypeOf<typeof e>().toEqualTypeOf<
  Array<["host" | "port" | "tls", string | number | boolean]>
>();

describe("typed keys/entries are runtime-honest", () => {
  assert(k.length === 3, "all three keys enumerated");
  for (const key of k) {
    const allowed: Array<"host" | "port" | "tls"> = ["host", "port", "tls"];
    assert(allowed.includes(key), `key ${key} is a declared key`);
  }
  for (const [key, value] of e) {
    const ok =
      (key === "host" && typeof value === "string") ||
      (key === "port" && typeof value === "number") ||
      (key === "tls" && typeof value === "boolean");
    assert(ok, `value for ${key} matches its declared type`);
  }
});
