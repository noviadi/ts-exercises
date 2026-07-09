/**
 * SOLUTION — `Record<K, V>` with a finite key union is safer
 *
 * `Record<K, V>` is, under the hood, a mapped type over the keys in `K`:
 *
 *   type Record<K extends string | number | symbol, V> = { [P in K]: V };
 *
 * Because it's a *mapped* type (not a bare index signature), TypeScript keeps
 * each key in `K` as a KNOWN property. That has three concrete consequences:
 *
 *   1. **Autocomplete** — type `env.` and you get `HOME`, `PATH`, `USER`.
 *   2. **No widening** — known keys stay `string`, NOT `string | undefined`,
 *      even with `noUncheckedIndexedAccess` ON. (That flag only affects
 *      *index-signature* and *array* reads, not known keys.)
 *   3. **Unknown keys error** — `env["SHELL"]` is a real compile error,
 *      because `SHELL` is not in the key union. With an index signature it
 *      would silently type as `string | undefined`.
 *
 * Note on `noPropertyAccessFromIndexSignature`: it does NOT affect `Record`
 * whose keys are a finite union — those are KNOWN keys, so dot-access stays
 * legal and gives you autocomplete. The flag only bites bare index signatures.
 */

// explanation: a finite key union. This is a MAPPED type, not an index
// signature — the difference is what preserves the keys.
type Env = Record<"HOME" | "PATH" | "USER", string>;

const env: Env = { HOME: "/h", PATH: "/bin", USER: "root" };

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — known keys are precisely `string`, not widened to `string | undefined`.
expectTypeOf<typeof env["HOME"]>().toEqualTypeOf<string>();
expectTypeOf<typeof env["PATH"]>().toEqualTypeOf<string>();
expectTypeOf<typeof env["USER"]>().toEqualTypeOf<string>();

// explanation: `SHELL` is NOT in the key union `"HOME" | "PATH" | "USER"`, so
// this is a genuine compile error — exactly the safety an index signature
// cannot give you. Contrast with the previous exercise, where the absent key
// `totallyAbsent` was silently typed `string | undefined`.
// @ts-expect-error  Property 'SHELL' does not exist on type 'Env'.
env["SHELL"];

// Dot-access on a finite-key Record is fine: these are KNOWN keys, so
// `noPropertyAccessFromIndexSignature` does not apply here.
expectTypeOf<typeof env.HOME>().toEqualTypeOf<string>();

describe("Record keeps known keys precise", () => {
  assert(env.HOME === "/h", "HOME dot-access works at runtime");
  assert(typeof env.PATH === "string", "PATH is a known string key");
});
