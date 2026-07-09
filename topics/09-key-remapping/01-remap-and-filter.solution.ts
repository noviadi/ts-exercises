/**
 * SOLUTION — Key remapping and filtering with `as`
 *
 * The `as` clause is a *rename* step bolted onto a mapped type:
 *
 *       { [K in keyof T as NewKey]: T[K] }
 *       //                ^^^^^^
 *       //                per-key: produce a NEW key name (or `never` to drop)
 *
 * Two canonical patterns live here:
 *
 *   1. RENAME: feed `K` through a string transform (Capitalize, Uppercase, a
 *      template literal, …). The value type `T[K]` is unchanged.
 *
 *   2. FILTER: use a conditional that resolves to `never` for keys you want
 *      gone. A `never` key is simply elided from the final key set, so the
 *      property disappears entirely. This is exactly how `Omit` is now
 *      written in TS's own lib — and unlike the old `Pick<T, Exclude<…>>`
 *      trick, it preserves modifiers (it's still homomorphic in T).
 *
 * Why `K & string`? The intrinsic helpers (`Capitalize`, `Uppercase`, …) only
 * accept `string`. A key may legally be `number` or `symbol`; intersecting
 * with `string` narrows out those non-string keys (they become `never` and are
 * dropped), which is what you almost always want for name-based remapping.
 */

type Source = { foo: number; bar: string };

// explanation: Capitalize takes "foo" -> "Foo". `K & string` makes the
// intrinsic happy and silently drops any non-string keys.
type CapitalizedKeys<T> = {
  [K in keyof T as Capitalize<K & string>]: T[K];
};

// explanation: Uppercase takes "foo" -> "FOO" (whole string uppercased; only
// meaningful when K is a literal type, which it is for object literal types).
type UpperKeys<T> = {
  [K in keyof T as Uppercase<K & string>]: T[K];
};

// explanation: per-key conditional. For the field we want to drop, the new
// key is `never` -> elided. For everything else, keep the original key `P`
// and its value type `T[P]` (homomorphic, so modifiers are preserved).
type RemoveField<T, Field extends keyof T> = {
  [P in keyof T as P extends Field ? never : P]: T[P];
};

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — compile-time.
expectTypeOf<CapitalizedKeys<Source>>().toEqualTypeOf<{ Foo: number; Bar: string }>();
expectTypeOf<UpperKeys<Source>>().toEqualTypeOf<{ FOO: number; BAR: string }>();
expectTypeOf<RemoveField<{ kind: "x"; value: number }, "kind">>().toEqualTypeOf<{
  value: number;
}>(); // filtering via `as never`

// RemoveField preserves optionality (homomorphic), unlike Pick-based Omit
// built before the `as` clause existed:
expectTypeOf<RemoveField<{ a?: string; b: number }, "b">>().toEqualTypeOf<{
  a?: string;
}>();

// RUNTIME — mirror the type-level `RemoveField` at the value level, so we can
// actually exercise dropping a key.
function removeField<T extends object, F extends keyof T>(
  obj: T,
  field: F,
): RemoveField<T, F> {
  const { [field]: _drop, ...rest } = obj;
  // explanation: `rest` is typed as `Omit<T, F>` (TS's own structural guess),
  // which doesn't *syntactically* overlap with our hand-rolled
  // `RemoveField<T, F>` — even though they describe the same shape. Route
  // through `unknown` to assert we know the types are equivalent.
  return rest as unknown as RemoveField<T, F>;
}

describe("01-remap-and-filter runtime checks", () => {
  const input = { kind: "circle" as const, radius: 7, label: "dot" };
  const noKind = removeField(input, "kind");

  assert(!("kind" in noKind), "kind key is gone at runtime");
  assert(noKind.radius === 7, "radius survives");
  assert(noKind.label === "dot", "label survives");

  // Demonstrate that CapitalizedKeys is a real, namable shape — we can
  // construct one explicitly and it must match.
  const cap: CapitalizedKeys<Source> = { Foo: 1, Bar: "x" };
  assert(cap.Foo === 1 && cap.Bar === "x", "remapped keys are usable");

  // The fresh-literal excess-property check protects the new names: passing
  // the old key now fails. (Commented out — uncomment to see the error.)
  // @ts-expect-error  'foo' does not exist on CapitalizedKeys<Source>; it's 'Foo'
  const _bad: CapitalizedKeys<Source> = { foo: 1, bar: "x" };
  void _bad;
});
