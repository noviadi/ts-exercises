/**
 * Shared helpers for the TypeScript kata.
 *
 * Two kinds of "tests" are used across these exercises:
 *
 *  1. RUNTIME checks  — executed when you run the file with `npm run run <file>`
 *                       (or `npx tsx <file>`). These verify behaviour.
 *
 *  2. TYPE checks     — verified by `npm run typecheck` (i.e. `tsc --noEmit`).
 *                       These compile-error if the types are wrong. We lean on
 *                       the `expect-type` library, whose `expectTypeOf` produces
 *                       a *compile-time* failure when an assertion is wrong.
 *
 * A solution is considered correct when BOTH pass for its file.
 */

// ---------------------------------------------------------------------------
// Runtime helpers
// ---------------------------------------------------------------------------

/** Throw if `value` is falsy. Use it like a tiny test runner. */
export function assert(value: unknown, message = "assertion failed"): asserts value {
  if (!value) {
    throw new Error(message);
  }
}

/** Structural deep-equality for plain JSON-ish values (good enough for kata). */
export function assertEquals<T>(actual: T, expected: T, message?: string): void {
  const a = JSON.stringify(actual, (_k, v) =>
    typeof v === "bigint" ? v.toString() : v,
  );
  const e = JSON.stringify(expected, (_k, v) =>
    typeof v === "bigint" ? v.toString() : v,
  );
  if (a !== e) {
    throw new Error(message ?? `Expected ${e}, got ${a}`);
  }
}

/** Group a few assertions and report results to the console. */
export function describe(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    console.error(`✗ ${name}`);
    console.error(`  ${(err as Error).message}`);
    process.exitCode = 1;
  }
}

// ---------------------------------------------------------------------------
// Type-only helpers
// ---------------------------------------------------------------------------

/**
 * `IsEqual<A, B>` — a precise structural equality for types.
 *
 * The classic `A extends B ? B extends A ? true : false : false` trick is the
 * standard way to ask "are these two types identical?" in TypeScript, because
 * `any` breaks the naive `extends` check.
 *
 * Explanation:
 *   - `(<T>() => T extends A ? 1 : 2)` is a *type* whose only difference from
 *     `(<T>() => T extends B ? 1 : 2)` is whether it mentions `A` or `B`.
 *   - Comparing these two function types forces TypeScript to check for true
 *     identity rather than mere assignability, which correctly handles `any`
 *     and `never` edge cases that the simple form gets wrong.
 */
export type IsEqual<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

/** `true` when `T` is exactly `never`. */
export type IsNever<T> = [T] extends [never] ? true : false;

/** `true` when `T` is exactly `any`. */
export type IsAny<T> = 0 extends 1 & T ? true : false;

/** `true` when `T` is a tuple (a fixed-length array), false for `number[]`. */
export type IsTuple<T> = T extends readonly unknown[]
  ? number extends T["length"]
    ? false
    : true
  : false;

/** Re-export so exercises can write `expectTypeOf` without an extra import. */
export { expectTypeOf } from "expect-type";
