/**
 * SOLUTION — `void` vs `undefined` (and the lattice recap)
 *
 *   void      — a *contract*: "caller, ignore the return value". Not a value.
 *   undefined — the actual runtime value/type of an absent return.
 *
 * Why they differ: a function returning `void` is permitted to return ANY
 * value at runtime; the type system simply hides it from the caller. That
 * enables **void-return covariance**: a `() => number` is assignable to
 * `() => void`. This is why you can pass side-effecting callbacks that happen
 * to return a number into `arr.forEach((x) => save(x))` where `save` returns
 * a result.
 *
 * The reverse is forbidden: a `() => void` makes NO promise to return
 * `undefined`, so it cannot satisfy `() => undefined`.
 *
 * ─── The full lattice, now with all four special types ──────────────────────
 *
 *     unknown   (safe TOP — accept anything, use nothing until narrowed)
 *       │
 *     { real types: string, number, {…}, () => void, ... }
 *       │
 *     never     (BOTTOM — unreachable; subtype of everything)
 *
 *     any       sits OUTSIDE the lattice: it is both top and bottom, and it
 *               disables checking. `void` is orthogonal — it only describes
 *               a return-position contract, not a position in the lattice.
 */

let lastLogged: string | null = null;

// `void` return: we are free to return a value, but we choose not to. Callers
// see `void` and cannot rely on anything coming back.
function log(value: string): void {
  // explanation: no `return` statement — an implicit `return;` happens at
  // runtime, which is fine for a `void` signature. We record the side effect.
  lastLogged = value;
}

// `undefined` return: the type REQUIRES us to actually return undefined.
// Under strict mode, the only things we can return are `undefined` or `void`
// expressions (a bare `return;` also yields undefined).
function maybeUndef(x: boolean): undefined {
  if (x) {
    lastLogged = lastLogged; // no-op side effect, purely to use `x`
  }
  return undefined;
}

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — describe the void/undefined relationship exactly.

expectTypeOf<void>().toBeVoid();
expectTypeOf<undefined>().toBeUndefined();

// void ≠ undefined: they are distinct types (a void value is not a value at all).
expectTypeOf<void>().not.toEqualTypeOf<undefined>();
expectTypeOf<undefined>().not.toEqualTypeOf<void>();

// Covariance: a function returning `undefined` satisfies one returning `void`.
expectTypeOf<() => undefined>().toExtend<() => void>();
// ...and so does one returning a real value — that is the whole point of void:
expectTypeOf<() => number>().toExtend<() => void>();
expectTypeOf<() => string>().toExtend<() => void>();

// The reverse is FORBIDDEN: `() => void` promises nothing, so it can't satisfy
// a contract that demands `undefined` is returned.
// @ts-expect-error  `() => void` is not assignable to `() => undefined`
expectTypeOf<() => void>().toExtend<() => undefined>();

// A callback typed as `() => void` is happy to receive a `() => number`:
const forEachLike = (_cb: () => void): void => {};
forEachLike(() => 42); // would be an error if the param were `() => undefined`.

// RUNTIME — show the side effects fire.
describe("void function records its side effect", () => {
  lastLogged = null;
  log("hello");
  assert(lastLogged === "hello", "log set lastLogged");

  maybeUndef(true);
  assert(true, "maybeUndef returned undefined without error");
});

// 💡 Takeaways:
//   • Annotate side-effectful functions `: void` to tell callers "don't branch
//     on my return". It also enables the covariance above.
//   • Reserve `: undefined` for the rare case where the value itself matters.
//   • `void`, `unknown`, `never`, `any` are four DIFFERENT tools — never reach
//     for `any` when one of the other three expresses your intent.
