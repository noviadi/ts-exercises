/**
 * SOLUTION — The `Object.keys` unsoundness, and typed `keys` / `entries`
 *
 * Why the built-in `Object.keys` returns `string[]` and not `(keyof T)[]`:
 *
 *   At runtime an object may carry enumerable string keys that its STATIC type
 *   does not mention — prototype properties that happen to be enumerable,
 *   `Object.defineProperty(obj, "sneaky", { enumerable: true, value: 1 })`,
 *   assignment into a wider `Record<string, unknown>`, or an object that was
 *   originally shaped differently and narrowed. TypeScript can't prove none of
 *   that happened, so it conservatively widens to `string[]` — trading
 *   precision for honesty.
 *
 * The same erasure hits `Object.entries`: it returns `[string, any][]`,
 * dropping BOTH the key set and the value types.
 *
 * Our typed wrappers narrow with a cast. The cast is a *promise*: "for the
 * objects I pass in, no enumerable key outside `keyof T` exists." That promise
 * is honest for fresh object literals and for classes whose methods are
 * non-enumerable (the default). It is NOT honest for objects that have been
 * mutated through a wider type — and the runtime `describe` block below is how
 * you'd defensively check.
 */

import { describe, assert, expectTypeOf } from "@lib";

type Config = { host: string; port: number; tls: boolean };
const config: Config = { host: "localhost", port: 8080, tls: true };

// --- The built-ins lose everything: ----------------------------------------

const builtinKeys = Object.keys(config);
const builtinEntries = Object.entries(config);

// explanation: `Object.keys` always returns `string[]` — even though we KNOW
// the only declared keys are host/port/tls. The type refuses to lie for us.
expectTypeOf<typeof builtinKeys>().toEqualTypeOf<string[]>();
// And `Object.entries` matches the `object` overload, yielding `[string, any][]`.
// We check assignability (not identity) because `any` interacts awkwardly
// with `expect-type`'s exactness constraint:
expectTypeOf<typeof builtinEntries>().toExtend<Array<[string, unknown]>>();

// --- The fix: typed wrappers -----------------------------------------------

// explanation: the honest key set for a plain object IS `(keyof T)[]`. We cast
// to it; callers get autocomplete + exhaustiveness on the key union.
function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

// explanation: the honest value type is the UNION `T[keyof T]`. We CANNOT give
// each pair a correlated `(K, T[K])` from a flat `Object.entries` result — TS
// has no way to express "the value's type depends on which key this pair is."
// So we widen the value to the union; per-key narrowing is a runtime job (see
// the loop below).
function entries<T extends object>(obj: T): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

// --- CHECKS ----------------------------------------------------------------

const k = keys(config);
// The key union is now exactly the declared keys:
expectTypeOf<typeof k>().toEqualTypeOf<Array<"host" | "port" | "tls">>();

const e = entries(config);
// Each pair is `[declared-key, declared-value-union]`:
expectTypeOf<typeof e>().toEqualTypeOf<
  Array<["host" | "port" | "tls", string | number | boolean]>
>();

// Runtime: prove the cast is honest for a plain object — every enumerated key
// really is a declared key, and every value really matches its declared type.
// This is the defensive pattern you'd use when you CAN'T trust the input.
describe("typed keys/entries are runtime-honest", () => {
  assert(k.length === 3, "all three keys enumerated");
  for (const key of k) {
    const allowed: Array<"host" | "port" | "tls"> = ["host", "port", "tls"];
    assert(allowed.includes(key), `key ${key} is a declared key`);
  }
  for (const [key, value] of e) {
    // explanation: `value` is typed as `string | number | boolean` (the union)
    // but at runtime we correlate it back to its key and check the specific
    // type. This is exactly the narrowing the type system can't do for us.
    const ok =
      (key === "host" && typeof value === "string") ||
      (key === "port" && typeof value === "number") ||
      (key === "tls" && typeof value === "boolean");
    assert(ok, `value for ${key} matches its declared type`);
  }
});

// 💡 When NOT to trust the cast: if `config` had flowed through a
//    `Record<string, unknown>` and been mutated with extra keys, the cast
//    `as Array<keyof T>` would silently include those extras typed as
//    `keyof T` — a lie. The runtime guard above is the only real defence in
//    untrusted-boundary code. For internally-owned plain objects, the cast is
//    safe and is the idiomatic pattern.
