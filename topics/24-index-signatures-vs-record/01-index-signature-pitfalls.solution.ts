/**
 * SOLUTION — Pitfalls of string index signatures
 *
 * The trap, in one sentence: a string index signature knows the VALUE type but
 * has forgotten everything about the KEYS. So:
 *
 *   - `bag.a` and `bag["a"]` both have type `string` — but only the bracket
 *     form is even legal under `noPropertyAccessFromIndexSignature` (dot-access
 *     is forbidden because TS can't confirm the key belongs to the bag).
 *   - `bag["totallyAbsent"]` is *also* typed `string` — not an error, because
 *     the signature claims every string key exists. With
 *     `noUncheckedIndexedAccess` ON, all reads become `string | undefined`,
 *     which at least forces a null-check at the use site.
 *
 * The deeper problem: you lose autocomplete. Type `bag.` and the editor offers
 * nothing, because there are no *known* keys. That's why a finite `Record<K,
 * V>` (next exercise) is almost always the better choice when the key set is
 * even partly known.
 */

type StringBag = { [k: string]: string };

const bag: StringBag = { a: "alpha", b: "beta" };

// explanation: dot-access on an index-signature type is REJECTED by
// `noPropertyAccessFromIndexSignature`. You must use bracket notation instead,
// which is the deliberate speed-bump this flag installs.
// @ts-expect-error  Property 'a' comes from an index signature, so it cannot be accessed with dot notation under noPropertyAccessFromIndexSignature.
bag.a;

// explanation: bracket access is the legal form. Because
// `noUncheckedIndexedAccess` is ON, reading any index-signature key widens the
// *value* type to `string | undefined` — TS can't prove the key is present.
//
// Note the value-form `expectTypeOf(bag["a"])` here: it captures the type of
// the READ EXPRESSION. The type-query form `typeof bag["a"]` would NOT show the
// `| undefined` — indexed-access types don't model `noUncheckedIndexedAccess`,
// only actual property reads do. So we pass the value to make expect-type see
// what real code sees.
expectTypeOf(bag["a"]).toEqualTypeOf<string | undefined>();

// explanation: a key we never defined is STILL typed `string | undefined` — no
// compile error, because the index signature claims all string keys are valid.
// This is exactly the unsoundness `Record<K, V>` (next exercise) removes.
expectTypeOf(bag["totallyAbsent"]).toEqualTypeOf<string | undefined>();

import { assert, describe, expectTypeOf } from "@lib";

// Runtime demonstration of the unsoundness: an absent key reads as `undefined`
// at runtime, but the type system had no way to warn us.
describe("index signatures don't model absent keys", () => {
  const got = bag["totallyAbsent"];
  assert(got === undefined, "absent key is undefined at runtime (type said string | undefined)");
});
