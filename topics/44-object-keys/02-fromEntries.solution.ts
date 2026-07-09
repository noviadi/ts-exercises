/**
 * SOLUTION — Typed `fromEntries`: rebuild an object type from entry pairs
 *
 * `Object.fromEntries` is overloaded as
 *
 *   fromEntries<T>(entries: Iterable<readonly [string, T]>): { [k: string]: T };
 *   fromEntries<T>(entries: Iterable<readonly [number, T]>): { [k: number]: T };
 *
 * i.e. it returns an *index-signature* object. The literal keys ("host",
 * "port", …) are gone — you can't access `result.host` with any narrowing, and
 * `noPropertyAccessFromIndexSignature` means you must use bracket access too.
 *
 * We rebuild precision with a mapped type that iterates the union of entry keys
 * and looks up each key's value type with `Extract`:
 *
 *   FromEntries<E> = { [K in E[number][0]]: Extract<E[number], [K, _]>[1] }
 *
 *   - E[number]              — the union of all entry tuple types.
 *   - E[number][0]          — the union of every entry's key (a set of literals).
 *   - Extract<..., [K, _]>  — pick the single entry whose key IS this K.
 *   - [1]                   — that entry's value type.
 *
 * Because the mapped type's key set is the union of literals, the resulting
 * object has one declared property per literal key — no index signature.
 */

import { describe, assert, expectTypeOf } from "@lib";

type Entry = readonly [PropertyKey, unknown];

// explanation: the heart of the trick. `K` ranges over each literal key in the
// union; `Extract` selects the matching entry tuple; `[1]` projects its value.
// `K` is already a `PropertyKey` (it came from `Entry[0]`), so the mapped type
// is well-formed for string / number / symbol keys alike.
type FromEntries<E extends readonly Entry[]> = {
  [K in E[number][0] & PropertyKey]: Extract<E[number], readonly [K, unknown]>[1];
};

// explanation: the runtime builds the object imperatively (no `Object.fromEntries`
// needed) and casts to `FromEntries<E>`. The cast is honest: we literally just
// copied each `[k, v]` pair, so the runtime shape matches the static type.
function fromEntries<E extends readonly Entry[]>(entries: E): FromEntries<E> {
  const out: Record<PropertyKey, unknown> = {};
  for (const [k, v] of entries) {
    // explanation: bracket assignment into a Record is allowed even under
    // noPropertyAccessFromIndexSignature (that flag only blocks DOT access).
    out[k] = v;
  }
  return out as FromEntries<E>;
}

const entries = [
  ["host", "localhost"],
  ["port", 8080],
  ["tls", true],
] as const;

// CHECKS — the literal keys AND the literal value types are both preserved.
const obj = fromEntries(entries);
expectTypeOf<typeof obj>().toEqualTypeOf<{
  host: "localhost";
  port: 8080;
  tls: true;
}>();

describe("fromEntries round-trips values", () => {
  // explanation: because `obj` has declared properties (not an index
  // signature), DOT access works and is precisely typed.
  assert(obj.host === "localhost", "host preserved with literal type");
  assert(obj.port === 8080, "port preserved with literal type");
  assert(obj.tls === true, "tls preserved with literal type");
});

// 💡 Caveat — duplicate keys: if two entries share a key, the mapped type
//    yields a UNION of their value types for that property, but at runtime the
//    LAST entry wins. The type would then be a (silent) over-approximation.
//    For trusted input (e.g. the output of `entries()` from the previous
//    exercise, which is keyed by definition) this never happens.
