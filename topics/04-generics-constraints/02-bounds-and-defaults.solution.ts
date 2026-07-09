/**
 * SOLUTION — Generic bounds (`T extends U`) and defaults (`T = U`)
 *
 *   T extends U   → "T must be assignable to U". Two effects:
 *       (1) call sites passing something not assignable to U are rejected;
 *       (2) inside the body, a value of type T can be treated as a U, so you
 *           may use U's members (this is what unlocks `x.length`).
 *
 *   T = U         → default type argument, used when T cannot be inferred from
 *                   arguments (e.g. a zero-arg factory).
 *
 * Bounds are how you ask for "the family of things that have a length" without
 * losing the specific type at the call site: `getLength("abc")` still knows it
 * took a `string`, not some abstract `HasLength`.
 */

import { assert, describe, expectTypeOf } from "@lib";

// Bound: T must be assignable to `{ length: number }`. As a result, the body
// may legally read `x.length` without a cast. Call sites stay precise: T is
// inferred as the concrete argument type (string / number[] / [a,b] / ...).
function getLength<T extends { length: number }>(x: T): number {
  // explanation: the bound is the WHOLE reason `.length` typechecks here.
  // Without `extends { length: number }`, `x.length` would be an error.
  return x.length;
}

// Default: T = string. With no call-site inference available (zero args), the
// default applies. Callers can still override with an explicit type argument.
function makeContainer<T = string>(): { contents: T | undefined } {
  // explanation: we return `undefined` for contents; the type stays honest as
  // `T | undefined`. T defaults to `string` only when nothing else is given.
  return { contents: undefined };
}

// CHECKS — these now pass.

expectTypeOf(getLength("abc")).toEqualTypeOf<number>();
expectTypeOf(getLength([1, 2, 3])).toEqualTypeOf<number>();
expectTypeOf(getLength([true, false] as const)).toEqualTypeOf<number>();

// A `number` has no `.length`, so it does NOT satisfy the bound — compile error.
// We wrap these in a never-called function so they are still TYPE-CHECKED
// (the @ts-expect-error directives must point at real errors) but never
// EXECUTED at runtime (getLength(null) would otherwise crash).
function _deliberateTypeErrors(): void {
  // @ts-expect-error  `number` does not satisfy the constraint `{ length: number }`
  getLength(123);
  // @ts-expect-error  `null` does not satisfy the constraint `{ length: number }`
  getLength(null);
}
void _deliberateTypeErrors;

// Default type argument: no inference possible, so T falls back to `string`.
expectTypeOf(makeContainer()).toEqualTypeOf<{ contents: string | undefined }>();
// Explicit override beats the default:
expectTypeOf(makeContainer<number>()).toEqualTypeOf<{ contents: number | undefined }>();
expectTypeOf(makeContainer<boolean>()).toEqualTypeOf<{ contents: boolean | undefined }>();

// RUNTIME — prove getLength reads real lengths.
describe("getLength respects its bound at runtime", () => {
  assert(getLength("hello") === 5, "string length");
  assert(getLength([1, 2, 3]) === 3, "array length");
  assert(getLength({ length: 99, foo: "bar" }) === 99, "custom {length} object");
});

// 💡 Takeaways:
//   • A bound `T extends U` is the standard way to "require a capability"
//     (has-length, is-an-object, is-a-Promise, ...) while keeping precise types.
//   • Defaults make generics ergonomic for zero-arg factories and partial
//     application; they are a fallback, never an override of real inference.
//   • Bounds are enforced at the CALL SITE — bad arguments never reach your body.
