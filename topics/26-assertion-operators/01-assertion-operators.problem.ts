/**
 * PROMPT — Non-null `!` and definite-assignment `!:`
 *
 * Below are four small scenarios. Each currently relies on `any` as a
 * crutch. Replace each `any` with the MINIMAL safe type, and choose between
 * three tools:
 *
 *   1. Real narrowing (`if (x === null) return ...`)              — always safe.
 *   2. Assertion function (`assertNonNull(x)`, see Topic 17)      — safe + sound.
 *   3. Assertion OPERATOR (`x!` or `field!:`)                     — *only* when
 *      you can genuinely prove the value is non-null and the proof is too
 *      awkward to encode (e.g. a framework initialises the field for you).
 *
 * The runtime `describe(...)` checks must still pass. The compile-time
 * `expectTypeOf` checks must pass too. Comments flag the spots where `!`
 * is defensible vs where it would hide a bug.
 *
 * Rules:
 *   - Do NOT change the `assert`/`describe` runtime checks.
 *   - Use `import type` for type-only imports (verbatimModuleSyntax is ON).
 *
 * Run:  npx tsc --noEmit 01-assertion-operators.problem.ts
 *       npx tsx           01-assertion-operators.problem.ts
 */

import { assert, describe, expectTypeOf } from "@lib";

// -----------------------------------------------------------------------------
// Scenario A — `Map.get` returns `T | undefined`. Choose narrowing or assertion.
// -----------------------------------------------------------------------------

function lookupA<K, V>(map: Map<K, V>, key: K): V {
  // TODO: replace this `any` with a safe implementation.
  // HINT: the assert-function pattern below is the right call here, because
  // we want a *runtime* throw if the key is missing, not just a type lie.
  const value: any = map.get(key);
  return value;
}

// -----------------------------------------------------------------------------
// Scenario B — DOM lookup. `document.getElementById` returns `HTMLElement | null`.
// -----------------------------------------------------------------------------

declare const document: {
  getElementById(id: string): HTMLElement | null;
};

function focusById(id: string): void {
  // TODO: implement. Here a non-null assertion `!` is *defensible* because
  // the call site immediately checks; pick the safest tool that still compiles.
  // (Fill in the body.)
}

// -----------------------------------------------------------------------------
// Scenario C — Definite-assignment. A framework assigns this field after
// `super()` but before any method runs; TS can't see that.
// -----------------------------------------------------------------------------

class Validator {
  // TODO: replace `any` with `RegExp` and pick the right assertion so strict
  // property initialisation is satisfied without lying about nullability.
  private pattern: any;

  test(s: string): boolean {
    return this.pattern.test(s);
  }
}

// -----------------------------------------------------------------------------
// Scenario D — A small assert-function (Topic 17). Use it to make Scenario A sound.
// -----------------------------------------------------------------------------

// TODO: declare `assertNonNull<T>(x: T): asserts x is NonNullable<T>` and use it.

// -----------------------------------------------------------------------------
// CHECKS — must pass after you fix the TODOs.
// -----------------------------------------------------------------------------

describe("scenario A — lookupA throws on missing key", () => {
  const m = new Map([["a", 1]]);
  assert(lookupA(m, "a") === 1, "present key returns value");

  let threw = false;
  try {
    lookupA(m, "missing");
  } catch {
    threw = true;
  }
  assert(threw, "missing key must throw");
});

describe("scenario B — focusById narrows away null", () => {
  // Behavioural check only; the type check is below.
  focusById("absent-id"); // should NOT throw on a null element
});

describe("scenario C — Validator pattern works", () => {
  const v = new Validator();
  // The kata harness injects the pattern before `test` runs:
  (v as { pattern: RegExp }).pattern = /\d+/;
  assert(v.test("abc123") === true, "matches digits");
  assert(v.test("abc") === false, "no match");
});

// Type-level checks
expectTypeOf<ReturnType<typeof lookupA<string, number>>>().toEqualTypeOf<number>();

// NonNullable is the type-level half of `assertNonNull`:
type NB = NonNullable<number | null | undefined>;
expectTypeOf<NB>().toEqualTypeOf<number>();
