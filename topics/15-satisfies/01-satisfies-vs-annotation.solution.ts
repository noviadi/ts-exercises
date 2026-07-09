/**
 * SOLUTION — `satisfies` vs annotation vs `as`
 *
 * Three tools, three intents:
 *
 *   1. Annotation `const x: T = expr`
 *      ➜ Widens `x` to exactly `T`. Use when you WANT the wider type.
 *
 *   2. Assertion `expr as T`
 *      ➜ Tells the compiler "trust me." No real checking; can lie. Avoid for
 *         validation — reserve for genuine downcasts you can prove.
 *
 *   3. `expr satisfies T`
 *      ➜ Verifies `expr` is assignable to `T`, then keeps the *narrow*
 *         inferred type of `expr`.
 *
 * When does `satisfies` actually preserve a literal? When the contextual type
 * coming from the constraint is a *finite union of literals* (e.g. the `Status`
 * union below). Then each property keeps the specific literal that satisfies
 * the union. If the constraint is just `string`, the literal is widened — the
 * same as a plain `const`.
 *
 * Rule of thumb: reach for `satisfies` by default; switch to an annotation only
 * when you specifically want the wider type; reserve `as` for cases you can
 * justify with a nearby runtime check.
 */

import { assert, describe, expectTypeOf } from "@lib";

type Status = "open" | "closed" | "archived";
type StatusMap = Record<"draft" | "published", Status>;

// ANNOTATION — valid, but `annotated.draft` is widened to the full `Status`.
const annotated: StatusMap = { draft: "open", published: "closed" };
expectTypeOf<typeof annotated.draft>().toEqualTypeOf<Status>();

// SATISFIES — checked against `StatusMap`, AND each property's literal is
// preserved, because `Status` is a union of literals.
const good = { draft: "open", published: "closed" } satisfies StatusMap;
expectTypeOf<typeof good.draft>().toEqualTypeOf<"open">();
expectTypeOf<typeof good.published>().toEqualTypeOf<"closed">();
expectTypeOf<typeof good>().toExtend<StatusMap>();

// explanation: `satisfies` still rejects bad shapes — it is a real check, not
// an assertion. A literal outside the union fails:
// @ts-expect-error  '"nope"' is not assignable to '"open" | "closed" | "archived".
const bad = { draft: "nope", published: "closed" } satisfies StatusMap;
void bad;

describe("satisfies validates without widening", () => {
  assert(good.draft === "open", "literal value preserved at runtime");
  assert(annotated.draft === good.draft, "values equal, types differ");
});
