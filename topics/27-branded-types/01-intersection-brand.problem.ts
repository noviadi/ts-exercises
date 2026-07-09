/**
 * PROMPT — The intersection-brand trick
 *
 * Below, `UserId` and `OrderId` are plain `string` aliases. That means the
 * compiler will happily let you pass a `UserId` where an `OrderId` is
 * expected — they're structurally identical. Re-define them with a brand so
 * cross-assignment becomes a type error.
 *
 * The brand pattern:
 *
 *   type UserId = string & { readonly __brand: "UserId" };
 *
 * The runtime value is STILL a plain string (the extra "property" is a type
 * fiction — it doesn't exist at runtime). To create a branded value, expose
 * a "smart constructor" that validates input and casts at the boundary.
 *
 * Rules:
 *   - Do NOT change the runtime `describe`/`assert` checks; make them pass.
 *   - Make the `// @ts-expect-error` line below an actual compile error
 *     (it currently isn't, because plain `string` aliases mix freely).
 *
 * Run:  npx tsc --noEmit 01-intersection-brand.problem.ts
 *       npx tsx           01-intersection-brand.problem.ts
 */

import { assert, describe, expectTypeOf } from "@lib";

// TODO: re-define these with the intersection-brand trick.
type UserId = string;
type OrderId = string;

// TODO: a smart constructor for UserId. Validate (e.g. non-empty) then cast.
function userId(input: string): UserId {
  return input;
}

// TODO: a smart constructor for OrderId.
function orderId(input: string): OrderId {
  return input;
}

function fetchOrder(id: OrderId): string {
  return `order-${id}`;
}

// CHECKS — must pass.

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

// TODO: this MUST be a compile error after you add brands. Keep the
// `@ts-expect-error` and write the line that should fail.
// @ts-expect-error  a UserId is not an OrderId — brands prevent cross-assignment
fetchOrder(userId("u_123"));

// Type-level checks
expectTypeOf<UserId>().toExtend<string>(); // brands are still strings
expectTypeOf<UserId>().not.toEqualTypeOf<string>(); // ...but not *just* string
expectTypeOf<UserId>().not.toExtend<OrderId>(); // and not interchangeable
