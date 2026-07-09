/**
 * SOLUTION — Declaration merging & interface `extends`
 *
 * Two unique powers of `interface`:
 *
 *  1. **Declaration merging** — two `interface` declarations with the same name
 *     in the same scope are folded into one, with their members unioned
 *     together. A `type` alias CANNOT do this: re-declaring `type Config` is a
 *     hard "Duplicate identifier" error.
 *
 *  2. **`extends`** — an interface can `extends` one or more other interfaces
 *     to inherit their members. This reads more naturally than an intersection
 *     (`A & B`) and gives slightly better error messages.
 *
 * Why merging matters in the real world: it's the mechanism behind module
 * augmentation (Topic 30). When you write `declare global { interface Window
 * { myFlag: boolean } }`, you are *merging* into the built-in `Window`
 * interface — impossible with a `type` alias.
 */

interface Config {
  retries: number;
}

// explanation: SAME name as above. TypeScript merges this into the existing
// `Config`, so the effective type is now `{ retries: number; timeout: number }`.
// Both declarations must agree on the type of any overlapping key (a later
// declaration can't contradict an earlier one for the same property name — that
// would be a real error, not a merge).
interface Config {
  timeout: number;
}

// explanation: `extends` copies the members of `Config` into `HttpConfig`.
// The result is an interface with `retries`, `timeout` (from Config) AND
// `baseURL` (declared here). Multiple bases are allowed:
// `interface X extends A, B, C { ... }`.
interface HttpConfig extends Config {
  baseURL: string;
}

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — the merged + extended shapes, asserted precisely.

// Merging: `Config` now has BOTH `retries` and `timeout`.
expectTypeOf<Config>().toEqualTypeOf<{ retries: number; timeout: number }>();

// Extending: `HttpConfig` has everything `Config` has, plus `baseURL`.
expectTypeOf<HttpConfig>().toEqualTypeOf<{
  retries: number;
  timeout: number;
  baseURL: string;
}>();

// `HttpConfig` is assignable to `Config` (it has at least Config's members),
// but `Config` is NOT assignable to `HttpConfig` (it lacks `baseURL`).
expectTypeOf<HttpConfig>().toExtend<Config>();
// @ts-expect-error  Config is missing `baseURL`
expectTypeOf<Config>().toExtend<HttpConfig>();

// Runtime sanity check: an object can satisfy the merged shape directly.
describe("declaration merging produces a usable shape", () => {
  const cfg: Config = { retries: 3, timeout: 5000 };
  assert(cfg.retries === 3, "retries preserved from first declaration");
  assert(cfg.timeout === 5000, "timeout added by second declaration");

  const http: HttpConfig = { retries: 1, timeout: 1000, baseURL: "https://x" };
  assert(http.baseURL === "https://x", "HttpConfig extends Config");
});
