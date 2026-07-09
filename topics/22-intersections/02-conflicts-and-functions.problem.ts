/**
 * PROMPT — Conflicts, interfaces vs intersections, and function intersections
 *
 * Three subtleties in one exercise:
 *
 *  1. CONFLICT: if `A` and `B` require the SAME key with INCOMPATIBLE value
 *     types, the intersection's value type collapses to `never` — you cannot
 *     actually construct such a value.
 *
 *  2. INTERFACE vs INTERSECTION: when an `interface extends X` redeclares a
 *     property with an INCOMPATIBLE type, the interface ERRORS (it requires
 *     assignability); the equivalent `&` silently collapses to `never`. So
 *     interfaces and `&` are NOT interchangeable.
 *
 *  3. FUNCTIONS: the param rule FLIPS between union and intersection.
 *     - `(x: A) => void | (x: B) => void`  (union) is callable only with `A & B`.
 *     - `((x: A) => void) & ((x: B) => void)` (intersection) is callable with
 *       EITHER `A` or `B` (overload-like).
 *
 * Your job:
 *   1. Define `Conflict` as `{ a: string } & { a: number }` and observe `a`
 *      becomes `never`.
 *   2. Look at the `IExtends` interface and predict the type of `a`.
 *   3. Define `Fn` as the intersection of two function types and verify what
 *      argument it accepts.
 *   4. Fill in the CHECKS.
 *
 * Run:  npx tsc --noEmit 02-conflicts-and-functions.problem.ts
 */

// TODO: define the conflict intersection.
// type Conflict = ???

interface IBase {
  a: string;
}
// TODO: try `interface IExtends extends IBase { a: number }` and see that it
// ERRORS (interfaces require assignability on redeclaration), unlike `&`.

// TODO: define a function UNION `(x: A) => void | (x: B) => void` and a function
// INTERSECTION, then reason about what argument each accepts.
type A = { x: number };
type B = { y: number };
// type FnUnion = ???
// type FnIntersection = ???

import { expectTypeOf } from "@lib";

// CHECKS — fill these in.
// expectTypeOf<Conflict["a"]>().toBeNever();     // ❓ conflicting value type
// (try declaring IExtends — does it compile? annotate with @ts-expect-error)
// const unionFn: FnUnion = (x) => {};             // ❓ what arg does it accept?
// const interFn: FnIntersection = (x) => {};      // ❓ what arg does it accept?
