/**
 * SOLUTION — Covariance vs contravariance
 *
 * Variance answers: "if `Dog extends Animal`, how do *compound* types over them
 * relate?" Three rules, all of which we prove below.
 *
 * 1) ARRAYS are COVARIANT.
 *      Dog extends Animal  ⇒  Dog[]  assignable to  Animal[]
 *    TS allows this even though it is *unsound*: a `Dog[]` viewed as `Animal[]`
 *    could be pushed a `Cat`. TS accepts the trade-off for ergonomics.
 *
 * 2) FUNCTION PARAMETERS are CONTRAVARIANT (under `strictFunctionTypes`).
 *      `(x: Animal) => void`  assignable to  `(x: Dog) => void`   ✓
 *      `(x: Dog) => void`     assignable to  `(x: Animal) => void` ✗
 *    A callback that can handle ANY animal can certainly handle a dog. The
 *    reverse is unsafe: a dog-only callback would choke on a cat.
 *
 * 3) METHOD SHORTHAND is BIVARIANT.
 *      `{ visit(x: Animal): void }`  ⇄  `{ visit(x: Dog): void }`   (both ways)
 *    Methods declared with the `name(params): return` shorthand bypass strict
 *    function checks and accept EITHER direction. This is a deliberate
 *    compromise so OOP-ish overrides (with narrower params) still typecheck.
 */

class Animal {
  kind = "animal";
}
class Dog extends Animal {
  breed = "labrador";
}

import { expectTypeOf } from "@lib";

// --- Sanity: Dog is a subtype of Animal (covariance seed) ---
expectTypeOf<Dog>().toExtend<Animal>();
// @ts-expect-error  Animal is not a Dog — it lacks the `breed` member.
expectTypeOf<Animal>().toExtend<Dog>();

// --- (1) Arrays are COVARIANT: Dog[] → Animal[] holds, the reverse does not. ---
expectTypeOf<Dog[]>().toExtend<Animal[]>();
// explanation: this compiles, but it is the famous unsoundness — given
// `const animals: Animal[] = dogs;` you could legally `animals.push(cat)`.
// @ts-expect-error  Animal[] is not assignable to Dog[] — element type is wider.
expectTypeOf<Animal[]>().toExtend<Dog[]>();

// --- (2) Function params are CONTRAVARIANT under strictFunctionTypes. ---

// A function that can handle ANY animal CAN be used where a dog-handler is
// required — dogs are animals, so it's safe:
expectTypeOf<(x: Animal) => void>().toExtend<(x: Dog) => void>();
// @ts-expect-error  A dog-only handler is NOT a general animal handler.
expectTypeOf<(x: Dog) => void>().toExtend<(x: Animal) => void>();

// --- (3) Method shorthand is BIVARIANT — both directions accepted. ---
type VisitorMethod = { visit(x: Animal): void };
expectTypeOf<{ visit(x: Dog): void }>().toExtend<VisitorMethod>();
expectTypeOf<VisitorMethod>().toExtend<{ visit(x: Dog): void }>();

// explanation: the moment we'd write the SAME shape as a function-typed
// property (not method shorthand), strict contravariance comes back:
type VisitorProperty = { visit: (x: Animal) => void };
// @ts-expect-error  Property form is checked strictly (contravariantly).
expectTypeOf<{ visit: (x: Dog) => void }>().toExtend<VisitorProperty>();

// 💡 Takeaways:
//   • `Dog[]` is assignable to `Animal[]` (covariant, unsound). Reach for
//     `readonly` arrays (sub-exercise 02) when you want the sound version.
//   • A `(x: Animal) => void` is assignable to `(x: Dog) => void` (contravariant)
//     — but only for function-typed values. Method shorthand is bivariant.
//   • If you want strict checking on a callback field, declare it as a
//     PROPERTY whose type is a function literal, not as a method.
