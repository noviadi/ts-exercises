/**
 * SOLUTION — Cross-module safety: validate once, carry the proof in the type
 *
 * The killer application of branded types is *moving validation to the
 * boundary*. Once an input has been checked and branded, every function
 * downstream can take the branded type as an argument and skip its own
 * defensive checks — the brand IS the proof that validation happened.
 *
 *   HTTP request
 *      │  emailAddress(body.to)        ← validate ONCE here
 *      ▼
 *   EmailAddress                      ← the type carries the proof
 *      │
 *      ├─ sendEmail(to: EmailAddress) ← no re-validation needed
 *      ├─ logEmail(to: EmailAddress)
 *      └─ queueEmail(to: EmailAddress)
 *
 * The brand also makes the two concepts unmixable: a function that wants an
 * `EmailAddress` will reject a `UserId`, even though both erase to `string`.
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation: each kata file is standalone, so we re-declare the unique-
// symbol brand helper. In a real codebase this would live in a `brand.ts`
// module and be imported.
declare const __brand: unique symbol;
type Branded<T, B extends string> = T & { readonly [__brand]: B };

// Two domain concepts that share a runtime representation (`string`) but
// must never be confused. The brand literal ("UserId" vs "EmailAddress") is
// what makes them distinct at the type level.
type UserId = Branded<string, "UserId">;
type EmailAddress = Branded<string, "EmailAddress">;

/**
 * Boundary constructor for UserId. Validates, then attaches the brand.
 * Anything that takes a `UserId` downstream can trust the value was checked.
 */
function userId(input: string): UserId {
  if (input.length === 0) {
    throw new Error("UserId must be non-empty");
  }
  return input as UserId;
}

/**
 * Boundary constructor for EmailAddress. A more realistic validation (must
 * contain "@", with something on each side) lives here so that every
 * downstream call site can skip re-checking.
 */
function emailAddress(input: string): EmailAddress {
  const at = input.indexOf("@");
  // explanation: a deliberately simple check — the point is the pattern, not
  // a full RFC 5322 implementation. Real apps would use a schema lib (Zod,
  // @effect/schema) that returns a branded type on success.
  if (at < 1 || at === input.length - 1) {
    throw new Error(`not a valid email address: ${input}`);
  }
  return input as EmailAddress;
}

/**
 * Deep-stack function. Notice the parameter type: `EmailAddress`, NOT
 * `string`. Callers MUST hand us a value that came through `emailAddress()`,
 * which means it has already been validated. No defensive checks needed.
 */
function sendEmail(to: EmailAddress): string {
  return `sent to ${to}`;
}

/** Same idea: takes a `UserId`, refuses anything else. */
function loadUser(id: UserId): string {
  return `loaded ${id}`;
}

// -----------------------------------------------------------------------------
// CHECKS — runtime
// -----------------------------------------------------------------------------

describe("boundary validation", () => {
  const addr = emailAddress("user@example.com");
  assert(addr === "user@example.com", "erases to source string");
  assert(sendEmail(addr) === "sent to user@example.com");

  const id = userId("u_42");
  assert(loadUser(id) === "loaded u_42");
});

describe("emailAddress rejects junk", () => {
  const cases = ["", "no-at-sign", "@noleft.com", "noright@"];
  for (const c of cases) {
    let threw = false;
    try {
      emailAddress(c);
    } catch {
      threw = true;
    }
    assert(threw, `should reject: ${c}`);
  }
});

describe("userId rejects empty", () => {
  let threw = false;
  try {
    userId("");
  } catch {
    threw = true;
  }
  assert(threw, "empty id must throw");
});

// -----------------------------------------------------------------------------
// CHECKS — type-level
// -----------------------------------------------------------------------------

// Branded types are still strings (subtype), so they can be passed to APIs
// that accept `string` — e.g. template literals, JSON.stringify, etc.
expectTypeOf<UserId>().toExtend<string>();
expectTypeOf<EmailAddress>().toExtend<string>();

// ...but they are NOT identical to plain `string`.
expectTypeOf<UserId>().not.toEqualTypeOf<string>();
expectTypeOf<EmailAddress>().not.toEqualTypeOf<string>();

// And the two branded types are mutually exclusive — the headline guarantee.
expectTypeOf<EmailAddress>().not.toExtend<UserId>();
expectTypeOf<UserId>().not.toExtend<EmailAddress>();

// Boundary functions refuse raw strings — you MUST go through the
// constructor. This is the "illegal state unrepresentable" property.
// @ts-expect-error  raw string is not an EmailAddress — must go through emailAddress()
sendEmail("user@example.com");
// @ts-expect-error  raw string is not a UserId — must go through userId()
loadUser("u_42");

// And the two domains refuse each other's branded types:
// @ts-expect-error  a UserId is not an EmailAddress
sendEmail(userId("u_42"));
// @ts-expect-error  an EmailAddress is not a UserId
loadUser(emailAddress("user@example.com"));
