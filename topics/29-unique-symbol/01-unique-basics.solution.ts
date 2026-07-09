/**
 * SOLUTION — `unique symbol` vs plain `symbol`
 *
 * There are TWO kind-of-similar but very different TS types here:
 *
 *   - `symbol`          — the WIDE primitive type. Every `Symbol()` call
 *                         returns this type. TS does NOT track which symbol
 *                         it is, so any `symbol` is assignable to any other.
 *
 *   - `unique symbol`   — a NARROW type bound to ONE specific symbol identity.
 *                         Only available via `declare const s: unique symbol`
 *                         or `const s = Symbol()` at the top level (the literal
 *                         widening is suppressed). Two different `unique
 *                         symbol` declarations are NOT the same type.
 *
 * The "unique" part is what lets a symbol serve as a brand key inside a type:
 * a computed key `{ readonly [k]: T }` requires `k` to be a `unique symbol`
 * (or a string/number literal). A plain `symbol` is too wide — TS couldn't
 * tell brands apart, so it forbids the key outright.
 */

// explanation: plain `symbol` on both — these types are identical (both `symbol`).
declare const plainA: symbol;
declare const plainB: symbol;

// explanation: `unique symbol` pins the type to this one identity. The type
// `typeof uidA` is effectively "the symbol stored in uidA" and nothing else.
declare const uidA: unique symbol;
declare const uidB: unique symbol;

import { expectTypeOf } from "@lib";

// CHECKS — these read as documentation of the model.

// A unique symbol IS still a symbol (it extends the wide primitive type):
expectTypeOf<typeof uidA>().toExtend<symbol>();

// Two different unique symbols are NOT identical — each is its own type:
expectTypeOf<typeof uidA>().not.toEqualTypeOf<typeof uidB>();

// Two plain `symbol` variables ARE the same type — identity was never tracked:
expectTypeOf<typeof plainA>().toEqualTypeOf<typeof plainB>();

// --- Symbol as a computed key inside a TYPE -------------------------------

// explanation: a `unique symbol` works as a computed property key inside a
// type, producing a property whose key carries that symbol's identity. Because
// the identity is pinned, two brands keyed by two DIFFERENT unique symbols are
// distinct types (see exercise 02). This is the whole reason branded types
// reach for `unique symbol` rather than a plain `symbol`.
declare const brand: unique symbol;
type Tagged = { readonly [brand]: "tag" };

// Any object that has `[brand]: "tag"` is a `Tagged`; the brand key is hidden
// from normal `keyof` access but the type identity is exact.
expectTypeOf<Tagged>().toEqualTypeOf<{ readonly [brand]: "tag" }>();

// 💡 Why brands need `unique symbol` and not `symbol`: a plain `symbol` value
// has the WIDE `symbol` type, so two brands keyed by two different plain
// symbols would share the same key type and become mutually assignable —
// defeating the brand. Exercise 02 proves this concretely.
