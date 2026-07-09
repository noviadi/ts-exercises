/**
 * SOLUTION — The `this:` parameter
 *
 * A `this:` parameter is the FIRST parameter of a function and is purely
 * type-level — it is completely erased at runtime. It tells TypeScript "this
 * function may only be invoked as a method of an object assignable to T",
 * and inside the body it types `this` as T (instead of `any`/`unknown`).
 *
 *   function f(this: T, ...args) { /* `this` is T here *\/ }
 *
 * It does NOT add a real parameter — `f.length` is unaffected. Its only job is
 * to constrain the receiver and to type-narrow `this` inside.
 *
 * Why bother?
 *   - Catches `.call(wrongReceiver)` / detached-method bugs at compile time.
 *   - Under `noImplicitThis`, it's how you give a standalone function a typed
 *     `this` (so the body's `this.value` is checked, not `any`).
 */

type HasValue = { value: string };

// explanation: `this: HasValue` is a type-only first parameter. Inside the
// body, `this` is `HasValue`, so `this.value` is `string`. It's erased at
// runtime — the emitted JS is unchanged.
function toUpperCase(this: HasValue): string {
  return this.value.toUpperCase();
}

import { assert, describe, expectTypeOf } from "@lib";

const ok: HasValue = { value: "hi" };
const wrong = { kind: "x" };

// CHECKS — these now reflect the guarded receiver.

// Calling on a `HasValue` receiver is allowed:
toUpperCase.call(ok);

// Calling on something WITHOUT `value` is now a compile error. These calls
// live inside a never-invoked function so the @ts-expect-error type checks
// fire without executing (and crashing) at runtime.
function _rejectedReceivers() {
  // @ts-expect-error  Argument of type '{ kind: string; }' is not assignable to parameter of type 'HasValue'.
  toUpperCase.call(wrong);
  // explanation: a bare call with no receiver is rejected too — the `this:`
  // param must be supplied via .call/.bind/.apply or by being a method:
  // @ts-expect-error  The 'this' context of type 'void' is not assignable to method's 'this'.
  toUpperCase();
}
void _rejectedReceivers;

describe("toUpperCase runtime behaviour", () => {
  assert(toUpperCase.call({ value: "abc" }) === "ABC", "uppercases value");
});

// 💡 Takeaways:
//   • A `this:` parameter constrains the receiver AND types `this` in the body.
//   • It's erased at runtime — purely a compile-time guard.
//   • Combine with `--noImplicitThis` for fully checked standalone functions.
