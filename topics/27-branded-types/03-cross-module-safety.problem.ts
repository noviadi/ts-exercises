/**
 * PROMPT — Cross-module safety: validate once, carry the proof in the type
 *
 * A typical real-world use of brands: validate user input ONCE at the system
 * boundary (e.g. an HTTP handler), then let the validated value flow through
 * the rest of the codebase with a type that PROVES it was checked. Functions
 * deeper in the stack can take a branded type and skip re-validation.
 *
 * In this exercise we model two domain concepts, `UserId` and `EmailAddress`,
 * both branded from `string`. The point is the type-level guarantee:
 *
 *   - A function that takes `EmailAddress` will REFUSE a `UserId`.
 *   - A function that takes `UserId` will REFUSE a raw `string`.
 *   - The only way to produce either is through the matching smart
 *     constructor, which validates at the boundary.
 *
 * Your job: define the brands + constructors, then implement `sendEmail(to)`
 * and `loadUser(id)` so they only accept the correct branded type.
 *
 * Rules:
 *   - Reuse the `unique symbol` brand helper from 02 (re-declare it here —
 *     each kata file is standalone).
 *   - Keep `verbatimModuleSyntax` happy (`import type` for type-only).
 *   - The runtime `describe` checks must pass.
 *
 * Run:  npx tsc --noEmit 03-cross-module-safety.problem.ts
 *       npx tsx           03-cross-module-safety.problem.ts
 */

import { assert, describe, expectTypeOf } from "@lib";

// TODO: declare the brand + helper, define UserId + EmailAddress, expose
// `userId(s)` and `emailAddress(s)` constructors with validation, and
// implement `sendEmail`/`loadUser` below.

// function sendEmail(to: /* TODO */ ): string { ... }
// function loadUser(id: /* TODO */ ): string { ... }

// CHECKS — must pass once you implement the above.

// describe("boundary validation", () => {
//   const addr = emailAddress("user@example.com");
//   assert(addr === "user@example.com");
//   assert(sendEmail(addr) === "sent to user@example.com");
// });

// describe("emailAddress rejects junk", () => {
//   let threw = false;
//   try { emailAddress("not-an-email"); } catch { threw = true; }
//   assert(threw);
// });

// Type-level checks (after your brands exist):
// expectTypeOf<EmailAddress>().not.toExtend<UserId>();
// expectTypeOf<UserId>().not.toExtend<EmailAddress>();
