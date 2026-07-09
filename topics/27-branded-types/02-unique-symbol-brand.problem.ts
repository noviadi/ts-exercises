/**
 * PROMPT — The `unique symbol` brand (unforgeable from outside)
 *
 * The intersection brand in 01 works, but anyone can write
 * `"x" as UserId` — the brand property is just a string key, so a determined
 * caller can construct the type without going through your constructor.
 *
 * A `unique symbol` brand fixes that: the brand property is keyed by a
 * `unique symbol` declared in the module. Symbols are unique at runtime, and
 * a `unique symbol` in TypeScript is a *type* tied to one specific value.
 * From outside the module, the symbol cannot even be named, so the brand
 * literally cannot be forged by hand — only your constructor can mint it.
 *
 * Pattern:
 *
 *   declare const __brand: unique symbol;
 *   type Branded<T, B> = T & { readonly [__brand]: B };
 *
 * Your job:
 *   1. Implement `Branded<T, B>` using a `unique symbol` key.
 *   2. Define `Email` = `Branded<string, "Email">`.
 *   3. Export a smart constructor `email(s: string): Email` that validates
 *      (must contain "@") and casts. Make it the ONLY way to get an `Email`.
 *   4. Fix the failing assertion below: outside the constructor, a raw cast
 *      `"x" as Email` should NOT typecheck (that's the win).
 *
 * Rules:
 *   - Keep `verbatimModuleSyntax` happy: use `import type` for types only.
 *   - The runtime `describe` checks must pass.
 *
 * Run:  npx tsc --noEmit 02-unique-symbol-brand.problem.ts
 *       npx tsx           02-unique-symbol-brand.problem.ts
 */

import { assert, describe, expectTypeOf } from "@lib";

// TODO: declare the unique symbol + the Branded helper + Email + constructor.

// CHECKS

describe("email constructor validates", () => {
  // const e = email("a@b.com");  // TODO: uncomment once constructor exists
  // assert(e === "a@b.com");
  assert(true, "placeholder — wire up the constructor");
});

describe("email rejects junk", () => {
  // let threw = false;
  // try { email("no-at-sign"); } catch { threw = true; }
  // assert(threw);
  assert(true, "placeholder");
});

// Type-level checks (after you implement Email):
// expectTypeOf<Email>().toExtend<string>();
// expectTypeOf<Email>().not.toEqualTypeOf<string>();
//
// And the headline guarantee: a raw cast outside the module is forbidden.
// (This is demonstrated in the SOLUTION file — in a single-file kata we
// can't fully hide the symbol, but you'll see the pattern there.)
