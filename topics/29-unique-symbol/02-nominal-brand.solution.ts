/**
 * SOLUTION — Nominal brand with a `unique symbol`
 *
 * The brand pattern gives TypeScript *nominal* typing on top of its structural
 * core. The recipe:
 *
 *   1. Declare a `unique symbol` — its type identity is the "color" of the brand.
 *   2. Intersect your payload type with an object carrying a property keyed by
 *      that symbol: `number & { readonly [__u]: true }`.
 *
 * Because the brand key is a `unique symbol`, no other brand can have the same
 * key type. A plain `number` doesn't carry the marker, so it's rejected. An
 * `OrderId` carries a DIFFERENT unique-symbol key, so it's rejected too — even
 * though both wrap a plain number.
 *
 * Construction is gated behind a factory so the brand is added in exactly one
 * place (the caller can't forge it).
 */

// explanation: TWO distinct unique symbols. Their types are not equal (see 01),
// which is precisely what makes the brands mutually incompatible.
declare const __u: unique symbol;
declare const __o: unique symbol;

// explanation: intersection with a symbol-keyed marker. The marker is invisible
// to ordinary `keyof UserId` enumeration but very real to assignability checks.
export type UserId = number & { readonly [__u]: true };
export type OrderId = number & { readonly [__o]: true };

// explanation: the ONLY way to mint a `UserId`. Centralising construction here
// means callers can never accidentally produce one with an arbitrary object.
function userId(n: number): UserId {
  return n as UserId;
}

function getUser(id: UserId): UserId {
  return id;
}

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — these now describe the nominal reality.

// A plain number is NOT assignable to UserId (no brand marker present):
// @ts-expect-error  number is missing the [__u] brand
getUser(42);
// @ts-expect-error  number is missing the [__u] brand
expectTypeOf<number>().toExtend<UserId>();

// An OrderId is NOT assignable to a UserId — different brand identities:
// @ts-expect-error  OrderId carries [__o], not [__u]
expectTypeOf<OrderId>().toExtend<UserId>();

// But UserId IS assignable to number (the payload still flows through):
expectTypeOf<UserId>().toExtend<number>();
// And symmetrically:
expectTypeOf<OrderId>().toExtend<number>();

// `userId(...)` is the gateway: it accepts a number and yields a UserId.
expectTypeOf(userId).toBeCallableWith(7);
expectTypeOf(userId(7)).toEqualTypeOf<UserId>();

// Runtime sanity check: the factory and the typed function work end to end.
describe("UserId brand flows through the typed function", () => {
  const id = userId(123);
  assert(getUser(id) === 123, "branded UserId is still a number at runtime");

  // Brands are TYPE-LEVEL only — at runtime there is no real property:
  assert(Object.keys(id).length === 0, "brand is invisible at runtime");
});
