/**
 * SOLUTION — Overloads vs conditional types vs union returns
 *
 * Three legitimate ways to type "the return depends on the input's shape".
 * They produce *similar* call-site types here, but differ sharply in:
 *
 *   1. Inference precision on ambiguous input.
 *   2. Composability (can a generic caller forward `T` and keep it precise?).
 *   3. How much machinery you write.
 *
 * Tradeoffs at a glance:
 *
 *   ┌──────────────────────┬──────────────────────────────────────────────────┐
 *   │ Overloads            │ Best for FIXED, named shapes (string | bytes).   │
 *   │                      │ No inference of the chosen branch into a type.   │
 *   │                      │ Resolution is positional/first-match.            │
 *   ├──────────────────────┼──────────────────────────────────────────────────┤
 *   │ Conditional types    │ Compose: `ReturnType<typeof first>` is precise.  │
 *   │                      │ Distributes over unions; works with `infer`.     │
 *   │                      │ Best for type-level pipelines.                   │
 *   ├──────────────────────┼──────────────────────────────────────────────────┤
 *   │ Union return         │ Simplest; least precise. Caller can't tell which │
 *   │                      │ branch ran from the type alone. Use only when    │
 *   │                      │ the distinction doesn't matter.                  │
 *   └──────────────────────┴──────────────────────────────────────────────────┘
 */

import { assert, describe, expectTypeOf } from "@lib";

// --- Style A: overloads ----------------------------------------------------
// explanation: two call signatures, then one implementation. The signatures
// (not the implementation) are what callers see.
function firstOverload<T>(xs: T[]): T;
function firstOverload<T>(xs: T): T;
function firstOverload<T>(xs: T[] | T): T {
  return Array.isArray(xs) ? (xs[0] as T) : xs;
}

// --- Style B: conditional types -------------------------------------------
// explanation: a SINGLE generic signature whose return is computed by the type
// system. We constrain the input to `T[] | T` and the conditional maps each
// case. This composes: other types can `infer T` out of it cleanly.
function firstConditional<T>(xs: T[] | T): T extends (infer U)[] ? U : T {
  return (Array.isArray(xs) ? (xs as T[])[0] : xs) as T extends (infer U)[]
    ? U
    : T;
}

// --- Style C: plain union return ------------------------------------------
// explanation: the simplest version. The return type is just `T`, the same for
// every input shape — we lose the "this came from an array" information at the
// type level. Cheap to write, least expressive.
function firstUnion<T>(xs: T[] | T): T {
  return Array.isArray(xs) ? (xs[0] as T) : xs;
}

// CHECKS --------------------------------------------------------------------

// Style A — overloads: callers see precise per-overload return types.
expectTypeOf(firstOverload([1, 2, 3])).toEqualTypeOf<number>();
expectTypeOf(firstOverload(7)).toEqualTypeOf<number>();

// Style B — conditional: equally precise at the call site, AND composable
// (a generic caller preserves the relationship).
expectTypeOf(firstConditional([1, 2, 3])).toEqualTypeOf<number>();
expectTypeOf(firstConditional(7)).toEqualTypeOf<number>();

// Style C — union return: also `number` here, but only because both branches
// happened to share a return type. For a true input-shape distinction (e.g.
// `string => unknown` vs `Uint8Array => {value:string}` from 01-) this style
// is NOT expressive enough and you'd have to widen to a union return.
expectTypeOf(firstUnion([1, 2, 3])).toEqualTypeOf<number>();
expectTypeOf(firstUnion(7)).toEqualTypeOf<number>();

// explanation: the SHARP contrast between overloads and conditional types
// appears with an input whose type is itself a UNION (`number[] | number`),
// because the caller doesn't statically know which branch applies.
//
//   - Overloads need ONE signature to fit; a union-typed argument often fits
//     NEITHER (see 01- where `string | Uint8Array` is rejected outright).
//   - Conditional types distribute over the union input and yield a precise
//     union of results — they compose where overloads break down.
//
// That composability is THE reason generic libraries (effect, Zod, ts-toolbelt)
// prefer conditional types, while user-facing APIs with a few NAMED shapes
// (e.g. `parse(string)` vs `parse(Uint8Array)`) prefer overloads for nicer
// tooltips and per-shape documentation.

describe("first* runtime behaviour", () => {
  assert(firstOverload([10, 20]) === 10, "overload: array → first");
  assert(firstOverload(99) === 99, "overload: scalar → scalar");
  assert(firstConditional([10, 20]) === 10, "conditional: array → first");
  assert(firstConditional(99) === 99, "conditional: scalar → scalar");
  assert(firstUnion([10, 20]) === 10, "union: array → first");
  assert(firstUnion(99) === 99, "union: scalar → scalar");
});

// 💡 Takeaways:
//   • Prefer overloads when you have a few discrete, NAMED input shapes and a
//     human-friendly tooltip matters (lib API surface).
//   • Prefer conditional types when the mapping must COMPOSE — e.g. another
//     generic function wants to `infer` the element type from `first`'s return.
//   • Use a plain union return only when callers don't need to know which
//     branch produced the value.
