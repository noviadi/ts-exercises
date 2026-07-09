/**
 * SOLUTION — `never` (the bottom type)
 *
 * `never` = the type with no inhabitants. It sits at the BOTTOM of the
 * lattice:
 *
 *     unknown   (top)
 *       │
 *     string / number / ...
 *       │
 *     never     (bottom)
 *
 * Two consequences of "no value is `never`":
 *   ① `never` is assignable to ANY type  (a bottom is a subtype of everything).
 *   ② NOTHING (except `never`) is assignable to `never`.
 *
 * Practical reading: `never` means "unreachable". You meet it as the return
 * type of `throw`/infinite loops, and as the residual type after a switch has
 * matched every member of a union — which is what makes exhaustiveness checks
 * work (Topic 19).
 */

// A function that always throws never reaches a `return`. TS infers `never`
// as the return type, signalling "this does not return normally".
function fail(msg: string): never {
  throw new Error(msg);
}

// The classic exhaustiveness helper. It is only callable with a `never`
// argument — which is exactly what remains when every case of a discriminated
// union has been handled.
function assertNever(x: never): never {
  // explanation: we interpolate `x` freely. Because `x` is `never`, this body
  // is considered unreachable — TS allows it. At runtime, if a new union
  // member is ever added without updating the switch, this throws loudly.
  throw new Error(`Unexpected value: ${JSON.stringify(x)}`);
}

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.radius * s.radius;
    case "square":
      return s.size * s.size;
    default:
      // explanation: after the two cases, `s` has been narrowed to `never`
      // (the union is exhausted). `assertNever` accepts `never`, so this
      // compiles. If a third `kind` is later added to `Shape`, this default
      // stops being `never` and the switch becomes a compile error — the
      // whole point of the pattern.
      return assertNever(s);
  }
}

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — the bottom-type rules, encoded as passing assertions.

expectTypeOf<never>().toBeNever();

// ① `never` is assignable to every type. expect-type's `toExtend` cannot
// express this directly (a `never extends X` conditional distributes away to
// `never`, which confuses the matcher), so we prove the rule at the TYPE
// level instead, using the `[T]` anti-distribution trick: wrapping both
// sides in a 1-tuple stops `never` from distributing through the conditional.
type NeverIsSubtypeOfString = [never] extends [string] ? true : false;
type NeverIsSubtypeOfNumber = [never] extends [number] ? true : false;
type NeverIsSubtypeOfObj = [never] extends [{ a: 1 }] ? true : false;
type NeverIsSubtypeOfUnknown = [never] extends [unknown] ? true : false;
expectTypeOf<NeverIsSubtypeOfString>().toEqualTypeOf<true>();
expectTypeOf<NeverIsSubtypeOfNumber>().toEqualTypeOf<true>();
expectTypeOf<NeverIsSubtypeOfObj>().toEqualTypeOf<true>();
expectTypeOf<NeverIsSubtypeOfUnknown>().toEqualTypeOf<true>();

// ② Nothing else is assignable to `never`. expect-type CAN express this one,
// because the failure here is a real, non-distributing one:
// @ts-expect-error  `string` is not assignable to `never`
expectTypeOf<string>().toExtend<never>();

// `never` inside a union collapses away: `never | T` === `T`.
expectTypeOf<never | string>().toEqualTypeOf<string>();
expectTypeOf<never | never>().toEqualTypeOf<never>();

// RUNTIME — `fail` and `assertNever` always throw.
describe("never helpers always throw", () => {
  let threw = false;
  try {
    fail("boom");
  } catch {
    threw = true;
  }
  assert(threw, "fail throws");

  threw = false;
  try {
    assertNever(undefined as unknown as never);
  } catch {
    threw = true;
  }
  assert(threw, "assertNever throws");
});

describe("area handles every shape", () => {
  const c: Shape = { kind: "circle", radius: 2 };
  const sq: Shape = { kind: "square", size: 3 };
  assert(Math.abs(area(c) - Math.PI * 4) < 1e-9, "circle area");
  assert(area(sq) === 9, "square area");
});

// 💡 Takeaways:
//   • Read `never` as "unreachable" or "impossible". It documents intent.
//   • A `never` return type is a strong signal: callers can assume no normal
//     return, so branching on its result is pointless.
//   • `assertNever` turns "I forgot a case" into a COMPILE error — adopt it
//     in every default branch of a discriminated-union switch.
