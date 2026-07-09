/**
 * SOLUTION — Non-null `!` and definite-assignment `!:`
 *
 * Two "trust me" operators, both of which compile to *nothing* at runtime:
 *
 *   • `x!`     — non-null assertion. Narrows `T | null | undefined` → `T`.
 *   • `field!:` — definite-assignment assertion. Tells the compiler "I'll
 *                initialise this before it's read", so it stops complaining
 *                about `--strictPropertyInitialization`.
 *
 * Neither emits any JS. They are PURE type-system assertions. If the value
 * really is `null`, your program explodes — exactly as if you'd written
 * `as any`. That makes them "acceptable but smelly": fine when you can prove
 * the value is non-null and the proof is awkward to encode; dangerous when
 * used to silence a real nullable.
 *
 * The sound alternative is an ASSERTION FUNCTION (Topic 17):
 *
 *   function assertNonNull<T>(x: T): asserts x is NonNullable<T> {
 *     if (x === null || x === undefined) throw new Error(`Expected non-null`);
 *   }
 *
 * `asserts x is NonNullable<T>` BOTH throws at runtime AND narrows in the
 * caller's flow analysis. That's strictly safer than `!`, which only narrows.
 *
 * Mental model:
 *   `!`   = "compiler, shut up, I know better"  (UNVERIFIED)
 *   `assertNonNull(x)` = "verify at runtime, then shut up"  (VERIFIED)
 */

import { assert, describe, expectTypeOf } from "@lib";

// -----------------------------------------------------------------------------
// Scenario A — `Map.get` returns `T | undefined`. Use the assert-function.
// -----------------------------------------------------------------------------

/**
 * The sound helper. `asserts x is NonNullable<T>` is the magic phrase:
 *   - at RUNTIME it throws if `x` is null/undefined;
 *   - at COMPILE TIME every statement after the call sees `x` as `NonNullable<T>`.
 *
 * explanation: `NonNullable<T>` strips `null | undefined` from `T`, so
 * `asserts x is NonNullable<T>` narrows `(number | undefined)` to `number`.
 * This is exactly what `!` does at the type level — but it ALSO checks.
 */
function assertNonNull<T>(x: T): asserts x is NonNullable<T> {
  if (x === null || x === undefined) {
    throw new Error(`expected non-null/undefined value, got ${String(x)}`);
  }
}

function lookupA<K, V>(map: Map<K, V>, key: K): V {
  const value = map.get(key); // V | undefined
  assertNonNull(value); // narrows to V, throws if missing
  return value;
}

// -----------------------------------------------------------------------------
// Scenario B — DOM lookup. A `!` is defensible here ONLY at the boundary.
// -----------------------------------------------------------------------------

// `document` typed as the real DOM shape, with a stub implementation so the
// runtime checks can run headlessly. In a browser, `getElementById` returns
// `HTMLElement | null`; the stub mirrors that contract.
const document: {
  getElementById(id: string): { focus(): void } | null;
} = {
  // explanation: returns `null` for any id we didn't plant — exactly the case
  // we want `assertNonNull` to handle loudly.
  getElementById(_id: string) {
    return null;
  },
};

// explanation: `document.getElementById` returns `HTMLElement | null`. We can
// (a) narrow explicitly, (b) assert-function it, or (c) write `el!`. Here we
// pick (b) — `assertNonNull` — so that a missing element fails loudly instead
// of producing a "cannot read .focus of null" crash further down.
function focusById(id: string): void {
  const el = document.getElementById(id); // HTMLElement | null
  assertNonNull(el); // throws at runtime if absent; narrows to HTMLElement
  el.focus();
}

// Compare with the `!` version, which would compile but lie:
//
//   function focusByIdUnsafe(id: string): void {
//     document.getElementById(id)!.focus(); // ⚠ no runtime check
//   }
//
// Use `!` only when:
//   - you genuinely cannot encode the proof (e.g. framework lifecycle),
//   - OR you've already validated upstream and re-checking is wasteful,
//   - AND a crash here would be obvious and local.
// Prefer `assertNonNull` (or a real guard) whenever the value comes from
// an untrusted source like the DOM, the network, or user input.

// -----------------------------------------------------------------------------
// Scenario C — Definite-assignment `!:`. Here it's the right tool.
// -----------------------------------------------------------------------------

class Validator {
  // explanation: `pattern!:` says "I promise something will assign `pattern`
  // before `test()` runs." That's the framework-injection case: an external
  // setup step writes the field before any method is called, but the
  // compiler can't see it. `!:` documents that contract at the type level.
  //
  // If this WEREN'T actually guaranteed, the right fix would be to make the
  // field `pattern: RegExp | undefined` and check inside `test()` — i.e.
  // encode the nullable state instead of lying about it.
  private pattern!: RegExp;

  /** Framework/test hook: must be called before `test`. */
  setPattern(p: RegExp): void {
    this.pattern = p;
  }

  test(s: string): boolean {
    // After `!:`, `this.pattern` is typed as `RegExp` (not `RegExp | undefined`),
    // so `.test(...)` is callable without a guard.
    return this.pattern.test(s);
  }
}

// -----------------------------------------------------------------------------
// Anti-pattern reference: `!` HIDING a bug
// -----------------------------------------------------------------------------

// Suppose you saw this in a code review:
//
//   function head<T>(xs: T[]): T {
//     return xs[0]!; // ⚠️ hides the empty-array case as a runtime TypeError
//   }
//
// The honest signature is `T | undefined` (or throw explicitly). `!` here is
// smuggling an unproven invariant. Replace with an explicit assert-function
// if "non-empty" is a real precondition:
function headOrThrow<T>(xs: readonly T[]): T {
  const first = xs[0]; // T | undefined under noUncheckedIndexedAccess
  assertNonNull(first); // explicit, verifiable, debuggable
  return first;
}

// -----------------------------------------------------------------------------
// CHECKS
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

describe("scenario B — focusById throws on missing element", () => {
  let threw = false;
  try {
    focusById("absent-id"); // getElementById returns null → assertNonNull throws
  } catch {
    threw = true;
  }
  assert(threw, "missing element must throw, not crash later");
});

describe("scenario C — Validator pattern works", () => {
  const v = new Validator();
  v.setPattern(/\d+/);
  assert(v.test("abc123") === true, "matches digits");
  assert(v.test("abc") === false, "no match");
});

describe("headOrThrow throws on empty", () => {
  assert(headOrThrow([1, 2]) === 1, "returns head");
  let threw = false;
  try {
    headOrThrow([]);
  } catch {
    threw = true;
  }
  assert(threw, "empty array must throw");
});

// Type-level checks
expectTypeOf<ReturnType<typeof lookupA<string, number>>>().toEqualTypeOf<number>();

// `NonNullable<T>` is the type-level half of `assertNonNull`: it strips
// `null | undefined`. That's exactly what `x!` narrows to.
type NB = NonNullable<number | null | undefined>;
expectTypeOf<NB>().toEqualTypeOf<number>();

// An assertion function narrows to `NonNullable<T>`, which for `number | null`
// collapses to `number` — same shape `!` would produce, but verified.
expectTypeOf<
  ReturnType<typeof assertNonNull<number | null>>
>().toEqualTypeOf<void>();

// Contrast: `!` does not change the static type of `lookupA`'s return —
// `assertNonNull` already gave us a clean `V`. The signature is honest. We
// assert via the type, not by invoking `lookupA` (which would throw on an
// empty map).
expectTypeOf<ReturnType<typeof lookupA<string, number>>>().toBeNumber();
