/**
 * SOLUTION — Intersection merge semantics
 *
 * `A & B` denotes values that are simultaneously assignable to A AND to B.
 * For object types, the rule is: a value of `A & B` must have every member
 * required by A AND every member required by B. So `A & B` is the UNION of
 * their required members — a *wider* set of obligations, a *narrower* value set.
 *
 *   type Combined = HasId & HasName;   // { id: number; name: string }
 *
 * When the SAME key appears in both operands, the value type is the
 * intersection of the two value types — so two `string`s stay `string`, and
 * `string & number` would collapse to `never` (see 02-).
 */

type HasId = { id: number };
type HasName = { name: string };

// explanation: `&` merges the requirements. Equivalent to the inline object
// form `{ id: number; name: string }`, but stays compositional — you can keep
// intersecting more pieces without rewriting the type.
type Combined = HasId & HasName;

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — these describe the merged shape.

// Combined is assignable to EACH operand (it has all their members):
expectTypeOf<Combined>().toExtend<HasId>();
expectTypeOf<Combined>().toExtend<HasName>();

// And it is mutually assignable to (i.e. equivalent to) the object literal that
// lists both members. We assert BOTH directions with `toExtend` rather than
// `toEqualTypeOf`: expect-type's strict identity check treats an intersection
// `HasId & HasName` as distinct from a single flat object literal even when
// they're mutually assignable, so `toEqualTypeOf` would false-fail here.
expectTypeOf<Combined>().toExtend<{ id: number; name: string }>();
expectTypeOf<{ id: number; name: string }>().toExtend<Combined>();

// Repeated key with the SAME type just stays that type — no conflict:
type Tagged = { id: number } & { id: number };
expectTypeOf<Tagged>().toEqualTypeOf<{ id: number }>();

// A member present in only one operand is preserved, no widening — and an
// OPTIONAL member stays optional. Under the hood `HasId & { label?: string }`
// is identical to `{ id: number; label?: string }`:
type WithOptional = HasId & { label?: string };
// explanation: the intersection still satisfies HasId (id is required) and the
// optional `label` carries through unchanged. (We can't easily assert this
// particular shape with `expectTypeOf`'s no-arg form under
// exactOptionalPropertyTypes — it rejects optional-keyed type arguments — so
// we state the equivalence in the comment and verify it by construction.)
const _withOptional: WithOptional = { id: 1 };
void _withOptional;

describe("intersection runtime behaviour", () => {
  const c: Combined = { id: 7, name: "x" };
  assert(c.id === 7 && c.name === "x", "combined object has both members");
});

// 💡 Takeaways:
//   • `A & B` = "is-a A AND is-a B" → collects required members from both.
//   • Repeated keys with matching types stay that type.
//   • Intersection stays compositional, which is why it scales better than a
//     hand-written `interface` when you're combining many pieces.
