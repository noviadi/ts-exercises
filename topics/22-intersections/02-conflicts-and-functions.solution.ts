/**
 * SOLUTION — Conflicts, interfaces vs intersections, and function intersections
 *
 * Three rules, all of which surprise people the first time:
 *
 *  1. CONFLICTING INTERSECTION → `never`.
 *     `{ a: string } & { a: number }` requires `a` to be BOTH `string` AND
 *     `number`. No value satisfies that, so `a`'s type collapses to `never`.
 *     The intersection type itself still "exists" but is uninhabitable on that
 *     key, so you can't construct a real value of it.
 *
 *  2. INTERFACE EXTENDS → must be assignable (subtype), else a hard ERROR.
 *     When an interface extends a base and REDECLARES a property, the new type
 *     must be assignable to the base property — so narrowing `string` → `"hi"`
 *     is allowed, but redeclaring as `number` is a compile ERROR (not `never`).
 *     This is the key behavioural difference from `&`.
 *
 *  3. FUNCTIONS — union vs intersection flip the param rule.
 *     - `(x: A) => void | (x: B) => void`  (a UNION) is callable only with an
 *       `A & B` argument: you don't know which function you hold, so the
 *       argument must satisfy both (params are contravariant).
 *     - `((x: A) => void) & ((x: B) => void)`  (an INTERSECTION) is callable
 *       with EITHER an `A` or a `B` — it behaves like a pair of overloads.
 */

// --- 1. Conflict collapses to `never` -------------------------------------
type Conflict = { a: string } & { a: number };
// explanation: `a` must be `string & number` = `never`. The only value of type
// `never` is unconstructible, so no real object literal can satisfy Conflict.

// --- 2. Interface extends vs intersection on conflict ---------------------
interface IBase {
  a: string;
}
// explanation: a redeclared property in an interface must be ASSIGNABLE to the
// base property's type (it's a subtype check, like method overriding). So
// narrowing `string` → a string-literal is allowed, but an INCOMPATIBLE type
// (`number`) is a hard compile ERROR — the opposite of the intersection above,
// which silently produced `never` instead.
interface INarrow extends IBase {
  a: "hi"; // valid: the literal "hi" narrows `string`.
}
// @ts-expect-error  Interface incorrectly extends: `number` is not assignable to `string`.
interface IBroken extends IBase {
  a: number;
}

// --- 3. Function UNION vs INTERSECTION (params & args) --------------------
type A = { x: number };
type B = { y: number };

// explanation: a UNION of function types `Fa | Fb` describes "one of these
// functions, we don't know which". To call it SAFELY you must pass an argument
// acceptable to BOTH — i.e. `A & B`. This is the contravariant-parameter rule:
// for unions of callables, the legal argument type is the INTERSECTION.
type Fa = (x: A) => void;
type Fb = (x: B) => void;
type FnUnion = Fa | Fb;

// explanation: an INTERSECTION of function types `Fa & Fb` describes "callable
// as EITHER signature" — it behaves like a set of overloads. You can call it
// with an `A` OR with a `B`; you do NOT need both. An implementer receives the
// UNION `A | B` for the parameter (it must handle either call).
type FnIntersection = Fa & Fb;

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS --------------------------------------------------------------------

// 1. The conflicting `a` collapses to `never`:
expectTypeOf<Conflict["a"]>().toBeNever();

// 2. The valid interface NARROWING yields the literal type:
expectTypeOf<INarrow["a"]>().toEqualTypeOf<"hi">();

// 3. Function UNION requires `A & B` at the call site (must satisfy both):
//    The only argument acceptable is one with BOTH x and y.
const both: A & B = { x: 1, y: 2 };
// explanation: we use `declare const` so unionFn's type stays EXACTLY FnUnion.
// (If we initialised it — `const unionFn: FnUnion = (x: A) => {}` — TS would
// narrow it to the concrete function and the call-site errors below would
// disappear, defeating the demo.) The calls live inside a never-invoked
// function so the type checks fire without referencing the runtime-missing
// `unionFn` at startup.
declare const unionFn: FnUnion;
function _unionCallDemos() {
  unionFn(both); // ok — `A & B` satisfies both Fa's `A` and Fb's `B`
  // @ts-expect-error  `{ x: number }` is missing `y` — a union of functions needs A & B.
  unionFn({ x: 1 });
  // @ts-expect-error  `{ y: number }` is missing `x` — same reason.
  unionFn({ y: 2 });
}
void _unionCallDemos;

// 3b. Function INTERSECTION is callable as EITHER signature (overload-like):
const interFn: FnIntersection = (x: A | B) => {
  // explanation: implementing the intersection, the parameter is the UNION,
  // so we must narrow before touching a field:
  if ("x" in x) {
    assert(x.x >= 0, "A-branch field accessible after narrowing");
  }
};
interFn({ x: 1 }); // ok — matches the (x: A) signature
interFn({ y: 2 }); // ok — matches the (x: B) signature
// @ts-expect-error  neither overload accepts `{ z }` — must be A or B.
interFn({ z: 3 });

describe("intersection conflict & override runtime behaviour", () => {
  // INarrow's `a` is the literal "hi" at the type level; at runtime it's a string.
  const o: INarrow = { a: "hi" };
  assert(o.a === "hi", "interface narrowing kept the value");
});

// 💡 Takeaways:
//   • `{a:string} & {a:number}` ⇒ `a: never`. Intersection = AND, even for the
//     same key. Don't reach for `&` to "override".
//   • `interface extends` with an incompatible property is a hard ERROR (it
//     requires assignability); with a narrower subtype it OVERRIDES. That
//     error-vs-`never` contrast is the key behavioural difference from `&`.
//   • Function UNION (`Fa | Fb`) ⇒ call it with the INTERSECTION of params
//     (`A & B`), because you don't know which function you hold.
//   • Function INTERSECTION (`Fa & Fb`) ⇒ callable as EITHER signature
//     (overload-like); implementing it gives you the UNION of params.
