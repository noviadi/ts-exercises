/**
 * SOLUTION — `any` vs `unknown` (the safe top type)
 *
 *   any     = "trust me, I know what I'm doing" — disables checking both ways.
 *   unknown = "I have no idea what this is"    — a true TOP type: anything
 *             assigns in, but you can't USE it until you narrow.
 *
 * The mental model is a lattice:
 *
 *     unknown  (top — supertype of everything)
 *       │
 *     string / number / {…} / ...   (real types)
 *       │
 *     never    (bottom — subtype of everything)
 *
 * `any` breaks the lattice: it is simultaneously top and bottom, assignable
 * to and from every type. That is *why* it's dangerous — it lets bad data
 * flow silently. `unknown` gives you the "accept anything in" half of `any`
 * without the "let anything out" half.
 */

// `any`: the compiler suspends checking inside this function body.
// `x.length` is allowed even if the runtime value is `null`, `42`, etc.
function lengthAny(x: any): number {
  // explanation: no error, no warning — `any` is an opt-out. Prefer `unknown`.
  return x.length;
}

// `unknown`: anything can be PASSED in, but the body must NARROW before use.
function lengthUnknown(x: unknown): number {
  // explanation: `typeof` is the simplest narrowing. After this guard, TS
  // refines `x` from `unknown` to `string` inside the block, so `.length` is
  // both type-safe and documented.
  if (typeof x === "string") {
    return x.length;
  }
  return 0;
}

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — these now describe the lattice truth.

// `any` is assignable to EVERYTHING (it plays both top and bottom):
expectTypeOf<any>().toExtend<string>();
// ...and everything is assignable to `any`:
expectTypeOf<string>().toExtend<any>();
// expect-type also exposes dedicated predicates for the four special types:
expectTypeOf<any>().toBeAny();
expectTypeOf<unknown>().toBeUnknown();

// `unknown` is a true TOP: every type assigns into it.
expectTypeOf<string>().toExtend<unknown>();
expectTypeOf<number>().toExtend<unknown>();
expectTypeOf<{ a: number }>().toExtend<unknown>();
// ...and `any` is assignable to `unknown` too (any is "topper" in a sense):
expectTypeOf<any>().toExtend<unknown>();

// `unknown` is NOT assignable to a narrower type — you must narrow first.
// The assertion below is FALSE, so we mark it as a deliberate compile error:
// @ts-expect-error  `unknown` is not assignable to `string` without narrowing
expectTypeOf<unknown>().toExtend<string>();

// RUNTIME — prove the narrowing actually works at runtime too.
describe("lengthUnknown narrows safely", () => {
  assert(lengthUnknown("hello") === 5, "string length");
  assert(lengthUnknown(42) === 0, "non-string falls through to 0");
  assert(lengthUnknown(null) === 0, "null handled");
  assert(lengthUnknown(undefined) === 0, "undefined handled");
  assert(lengthUnknown(["a", "b"]) === 0, "array is not a string -> 0");
});

// 💡 Takeaways:
//   • At untyped boundaries (JSON.parse, fetch, postMessage, any) read into
//     `unknown` and narrow on the way in. You get flexibility WITHOUT unsoundness.
//   • `any` is a liability: it propagates. One `any` parameter makes every
//     downstream use of that value `any` too. `unknown` does not propagate.
