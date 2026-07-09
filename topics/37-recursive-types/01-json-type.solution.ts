/**
 * SOLUTION — The recursive `Json` type
 *
 * A JSON value is one of:
 *   - a primitive:  string | number | boolean | null
 *   - an array:     Json[]                          (recursion!)
 *   - an object:    { [key: string]: Json }         (recursion!)
 *
 * TypeScript resolves this recursion *lazily* — the alias mentions itself, but
 * always through an object or array wrapper, so the compiler never has to
 * expand it to a fixed depth. That's why this works without any conditional
 * guard: the recursion is hidden behind a structural boundary.
 *
 * Note on `noPropertyAccessFromIndexSignature`: because the object branch uses
 * an index signature, you must read its members with BRACKET notation
 * (`obj["key"]`, not `obj.key`). We do exactly that in the runtime section.
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation: each recursive branch wraps `Json` inside either `Json[]` or
// `{ [key: string]: Json }`. That wrapper is essential — it is what lets TS
// defer expansion. The union as a whole matches the JSON grammar exactly.
export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

// CHECKS — compile-time proof.
expectTypeOf<
  Json
>().toExtend<
  string | number | boolean | null | Json[] | { [k: string]: Json }
>();

// An object whose values are all Json IS a Json (structural, via index sig):
expectTypeOf<{ name: string; age: number }>().toExtend<Json>();

// A function is none of the Json branches:
// @ts-expect-error  Functions are not representable in JSON.
expectTypeOf<() => void>().toExtend<Json>();

// RUNTIME — a small `isJson` guard that mirrors the type, plus a sample value.
// The guard is intentionally permissive about the object/array recursion (JSON
// can nest arbitrarily deep) and rejects functions/symbols/bigints/undefined.
function isJson(value: unknown): boolean {
  if (value === null) return true;
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean") return true;
  if (Array.isArray(value)) return value.every(isJson);
  if (t === "object") {
    return Object.getOwnPropertyNames(value).every((key) => {
      // bracket access: the value is typed as `{ [k: string]: Json }`-ish, and
      // `noPropertyAccessFromIndexSignature` forces bracket notation anyway.
      return isJson((value as Record<string, unknown>)[key]);
    });
  }
  return false; // undefined, function, symbol, bigint
}

describe("isJson recognises valid JSON", () => {
  const sample: Json = {
    name: "ada",
    age: 36,
    active: true,
    tags: ["math", "computing"],
    meta: { born: 1815, alias: null },
  };
  assert(isJson(sample), "sample should be JSON-shaped");
  assert(
    isJson({ fn: () => 1 }) === false,
    "an object containing a function is NOT Json",
  );
  assert(isJson(undefined) === false, "undefined is not JSON");
});

// 💡 Takeaways:
//   • Recursive aliases work when recursion goes through a wrapper (object,
//     array, or union member). Direct `type X = X;` is rejected (see 02).
//   • The object branch `{ [key: string]: Json }` matches any JSON object, but
//     forces bracket access under `noPropertyAccessFromIndexSignature`.
//   • Pair the type with a runtime guard (`isJson`) if you ever need to narrow
//     `unknown` (e.g. parsed JSON) down to `Json` safely.
