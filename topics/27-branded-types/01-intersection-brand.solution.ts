/**
 * SOLUTION — The intersection-brand trick
 *
 * TypeScript is structurally typed: `type UserId = string` is just another
 * name for `string`, so a `UserId` and an `OrderId` are freely mixable. That
 * is a real bug class: passing a user ID into an API that wants an order ID.
 *
 * Branding fakes *nominal* typing by adding a phantom property to the type:
 *
 *   type UserId = string & { readonly __brand: "UserId" };
 *
 *   - At RUNTIME the value is still a plain string. The intersection with an
 *     object type is invisible — `typeof x === "string"`, `x.length` works,
 *     JSON serialisation is unaffected.
 *   - At the TYPE LEVEL the compiler now treats `UserId` and `OrderId` as
 *     distinct: a `UserId` lacks the `__brand: "OrderId"` property, so it is
 *     NOT assignable to `OrderId`.
 *
 * The catch: because the brand property doesn't exist at runtime, the only
 * way to *create* a branded value is to **cast** at a "smart constructor"
 * boundary. Keep constructors tiny, validate input, and cast there — never
 * scatter `as UserId` around the codebase.
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation: the brand is a property that exists only in the type system.
// Intersecting `string` with `{ readonly __brand: "UserId" }` adds a phantom
// tag the compiler uses to tell IDs apart. We mark it `readonly` so no one
// can widen it by reassignment in a type-level sense.
type UserId = string & { readonly __brand: "UserId" };
type OrderId = string & { readonly __brand: "OrderId" };

/**
 * Smart constructor for `UserId`. Validate at the boundary, then cast.
 *
 * The cast here is the *whole point* of branding: this is the one sanctioned
 * place where a raw string becomes a `UserId`. Everywhere else in the
 * codebase, `UserId` flows through typed code and cannot be confused with
 * `OrderId` — exactly the property we want.
 */
function userId(input: string): UserId {
  if (input.length === 0) throw new Error("UserId must be non-empty");
  // explanation: this `as UserId` is the lie we accept at the boundary. The
  // runtime value is unchanged; we're just attaching the brand at the type
  // level. Validation above is what keeps the lie honest.
  return input as UserId;
}

function orderId(input: string): OrderId {
  if (input.length === 0) throw new Error("OrderId must be non-empty");
  return input as OrderId;
}

function fetchOrder(id: OrderId): string {
  return `order-${id}`;
}

// -----------------------------------------------------------------------------
// CHECKS
// -----------------------------------------------------------------------------

describe("smart constructors keep runtime values as plain strings", () => {
  const u = userId("u_123");
  assert(u === "u_123", "userId erases to its source string");
  assert(typeof u === "string", "no runtime object — pure type fiction");
});

describe("userId rejects empty input at runtime", () => {
  let threw = false;
  try {
    userId("");
  } catch {
    threw = true;
  }
  assert(threw, "empty id must throw");
});

describe("fetchOrder with a real OrderId", () => {
  assert(fetchOrder(orderId("o_9")) === "order-o_9");
});

// The headline win: passing a UserId where an OrderId is wanted is now a
// *compile* error, not a silent runtime swap. The brand tags differ.
// @ts-expect-error  a UserId is not an OrderId — brands prevent cross-assignment
fetchOrder(userId("u_123"));

// Type-level checks
// A branded type is still assignable to `string` — it has every member
// `string` has, plus a phantom property. That's structural subtyping working
// in our favour: the brand is additive, so `UserId` is a subtype of `string`.
expectTypeOf<UserId>().toExtend<string>();
// ...but it is NOT identical to `string` — the phantom property makes them
// distinct types.
expectTypeOf<UserId>().not.toEqualTypeOf<string>();
// ...and two differently-branded types are NOT interchangeable.
expectTypeOf<UserId>().not.toExtend<OrderId>();
expectTypeOf<OrderId>().not.toExtend<UserId>();
// Both branded types are still assignable to plain `string` at the boundary.
expectTypeOf<OrderId>().toExtend<string>();

// Concrete illustration: an array of plain strings is NOT an array of UserId.
// You can read UserIds as strings (covariant, safe-ish), but not the reverse.
expectTypeOf<UserId[]>().toExtend<readonly string[]>();
// @ts-expect-error  string[] is not assignable to UserId[] — would let raw strings masquerade as UserIds
expectTypeOf<string[]>().toExtend<UserId[]>();
