/**
 * SOLUTION — The `unique symbol` brand (unforgeable from outside)
 *
 * The string-keyed brand in 01 (`__brand: "UserId"`) is simple but forgeable:
 * anyone who knows the key name can write `"x" as UserId` and bypass your
 * constructor. A **`unique symbol`** brand removes that escape hatch.
 *
 * The trick:
 *
 *   declare const __brand: unique symbol;
 *   type Branded<T, B> = T & { readonly [__brand]: B };
 *
 * Two things make this airtight across module boundaries:
 *
 *   1. `unique symbol` makes `__brand` a value-level symbol whose *type* is
 *      tied to that exact symbol. There is exactly one of it in the program.
 *   2. To create a value of type `Branded<T, B>`, you'd need to assign to
 *      `{ [__brand]: B }` — which requires access to the symbol value. If we
 *      keep the symbol itself inside this module and only export the TYPE,
 *      callers cannot spell `[__brand]`, so they cannot construct the brand
 *      by hand. Only the constructor (which is allowed to lie via `as`)
 *      can mint a branded value.
 *
 * At runtime the value is STILL just a plain string/number — the brand is
 * purely a type-level fiction, exactly like the string-keyed version.
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation: `declare const` gives us a value-level symbol declaration
// WITHOUT emitting any runtime code. `unique symbol` promotes it to a type
// that is unique across the whole program (two `unique symbol` declarations
// are never the same type, even with the same name).
declare const __brand: unique symbol;

/**
 * Generic brand helper. `T` is the runtime representation; `B` is a string
 * literal naming what the brand means (e.g. "Email").
 *
 * `readonly [__brand]` is a *computed property* keyed by the unique symbol.
 * The intersection `T & { ... }` keeps the runtime value as `T` while adding
 * the phantom tag at the type level.
 */
type Branded<T, B extends string> = T & { readonly [__brand]: B };

// Concrete branded types. Each is a distinct nominal-ish type.
type Email = Branded<string, "Email">;
type PositiveInt = Branded<number, "PositiveInt">;

/**
 * The ONE sanctioned constructor. Validate, then cast.
 *
 * Outside this module, only the TYPE `Email` is exported (the kata is a
 * single file, but in real code you'd `export type Email` and keep the
 * constructor as the only `export function email`). Without access to the
 * `__brand` symbol value, no caller can fabricate an `Email` themselves.
 */
function email(s: string): Email {
  if (!s.includes("@")) {
    throw new Error(`not a valid email: ${s}`);
  }
  // explanation: the cast attaches the brand at the type level. Runtime value
  // is unchanged — still just a string.
  return s as Email;
}

function positiveInt(n: number): PositiveInt {
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error(`not a positive integer: ${n}`);
  }
  return n as PositiveInt;
}

// -----------------------------------------------------------------------------
// CHECKS
// -----------------------------------------------------------------------------

describe("email constructor validates", () => {
  const e = email("a@b.com");
  assert(e === "a@b.com", "email erases to its source string");
  assert(typeof e === "string", "no runtime object — pure type fiction");
});

describe("email rejects junk", () => {
  let threw = false;
  try {
    email("no-at-sign");
  } catch {
    threw = true;
  }
  assert(threw, "missing @ must throw");
});

describe("positiveInt rejects non-positive", () => {
  let threw = false;
  try {
    positiveInt(-3);
  } catch {
    threw = true;
  }
  assert(threw, "negative must throw");

  const p = positiveInt(7);
  assert(p === 7, "erases to source number");
  assert(typeof p === "number", "still a number at runtime");
});

// Type-level checks
expectTypeOf<Email>().toExtend<string>();
expectTypeOf<Email>().not.toEqualTypeOf<string>();
expectTypeOf<PositiveInt>().toExtend<number>();
expectTypeOf<PositiveInt>().not.toEqualTypeOf<number>();

// Different brands are NOT interchangeable — even though both erase to
// primitives. This is the cross-assignment protection we wanted.
expectTypeOf<Email>().not.toExtend<PositiveInt>();
expectTypeOf<PositiveInt>().not.toExtend<Email>();

// Demonstrate the unforgeability: trying to mint an Email WITHOUT the
// constructor fails, because we cannot name the symbol property at all.
// (Inside this single file we technically CAN see `__brand`, but the shape
// `string & { readonly [__brand]: "Email" }` still can't be created by a
// plain object literal — a `unique symbol`-keyed property is not writable
// by `{ [someKey]: ... }` literal syntax, so the only path is the cast in
// the constructor.)
//
// As a result, the only way an external caller can produce an `Email` is by
// calling `email(...)` — exactly the boundary we want to enforce.
//
// @ts-expect-error  a plain string is not an Email — no shortcut around the constructor
const _denied: Email = "a@b.com";
// Ensure the variable above is "used" so isolatedModules doesn't strip it.
void _denied;
