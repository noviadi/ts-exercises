/**
 * SOLUTION — `assertNever(x: never)` and switch exhaustiveness
 *
 * `assertNever` is a tiny helper whose parameter is the bottom type `never`
 * (Topic 02). Its job is to be the `default` arm of an exhaustive switch:
 *
 *   - After every real case has been handled, the leftover type IS `never`
 *     (nothing else remains of the union), so passing it to a function that
 *     requires `never` typechecks just fine.
 *   - At runtime it throws, so even a logically-impossible value is surfaced
 *     as an error rather than silently mishandled.
 *
 * The payoff: the moment you extend the union with a new variant but forget to
 * add its case, the leftover type in `default` is the NEW variant (not `never`),
 * and `assertNever(s)` STOPS compiling — a compile-time alarm. That is
 * sub-exercise 02.
 */

import { assert, describe, expectTypeOf } from "@lib";

type Shape =
  | { type: "circle"; radius: number }
  | { type: "square"; size: number }
  | { type: "triangle"; base: number; height: number };

// explanation: the `never` parameter type is the whole point. A value of any
// other type is NOT assignable, so the call site only compiles when the caller
// has already narrowed away every real variant.
function assertNever(x: never): never {
  throw new Error(`unhandled variant: ${JSON.stringify(x)}`);
}

// explanation: every case is handled; the default arm receives the type `never`
// because no Shape member survives the three narrows above. Routing it through
// assertNever makes the function exhaustive both at the type level (return type
// `string` is satisfied in every path) and at runtime (impossible state throws).
function describeShape(s: Shape): string {
  switch (s.type) {
    case "circle":
      return `circle r=${s.radius}`;
    case "square":
      return `square s=${s.size}`;
    case "triangle":
      return `triangle a=${(s.base * s.height) / 2}`;
    default:
      // s: never — proving exhaustiveness
      return assertNever(s);
  }
}

// CHECKS

// explanation: the default arm narrows `s` to `never` once every real variant
// has been matched — that is exactly the type `assertNever` demands. We assert
// it with `.toBeNever()` on the narrowed `typeof s`.
function _defaultIsNever(s: Shape): string {
  switch (s.type) {
    case "circle":
      return `r=${s.radius}`;
    case "square":
      return `s=${s.size}`;
    case "triangle":
      return `a=${(s.base * s.height) / 2}`;
    default:
      expectTypeOf<typeof s>().toBeNever();
      return assertNever(s);
  }
}
void _defaultIsNever;

// explanation: the parameter of assertNever only accepts `never`. Passing a
// concrete type is rejected at compile time — the @ts-expect-error proves it.
function _rejectsNonNever() {
  // @ts-expect-error  string is not assignable to `never`
  assertNever("oops");
}
void _rejectsNonNever;

function _describeReturn() {
  const out = describeShape({ type: "circle", radius: 1 });
  expectTypeOf<typeof out>().toBeString();
}
void _describeReturn;

// ---------------------------------------------------------------------------
// RUNTIME checks
// ---------------------------------------------------------------------------

describe("describeShape handles every variant", () => {
  assert(describeShape({ type: "circle", radius: 2 }) === "circle r=2");
  assert(describeShape({ type: "square", size: 3 }) === "square s=3");
  assert(
    describeShape({ type: "triangle", base: 4, height: 5 }) === "triangle a=10",
  );
});

describe("assertNever throws on the logically-impossible path", () => {
  let threw = false;
  try {
    // Cast to bypass the type guard and exercise the runtime safety net.
    assertNever({ type: "hexagon" } as unknown as never);
  } catch {
    threw = true;
  }
  assert(threw, "assertNever throws when somehow reached");
});
