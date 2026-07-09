/**
 * SOLUTION — readonly array covariance & a contravariant visitor
 *
 * Two ideas, both built on `Dog extends Animal`:
 *
 *  (A) `readonly` array covariance is SOUND.
 *        readonly Dog[]  →  readonly Animal[]   ✓  (and the reverse ✗)
 *      Because the target exposes no mutating methods (push, splice, write
 *      index), the consumer cannot smuggle a `Cat` in, so covariance costs no
 *      soundness. (Mutable arrays, by contrast, are covariant-but-unsound —
 *      see sub-exercise 01.)
 *
 *      `Dog[]` is assignable to `readonly Animal[]` (widening to a more
 *      restrictive view is always fine). The reverse — `readonly Dog[]` to
 *      `Animal[]` — fails because it would require granting write access that
 *      the source never had.
 *
 *  (B) A visitor position (`(a: Animal) => void`) is a contravariant slot.
 *        Passing a NARROWER callback `(d: Dog) => void` is rejected at the call
 *        site, exactly mirroring the type-level rule from 01.
 */

class Animal {
  kind = "animal";
}
class Dog extends Animal {
  breed = "labrador";
}
class Cat extends Animal {
  purr = true;
}

import { assert, describe, expectTypeOf } from "@lib";

// --- Sanity: the subtype relation that seeds everything below. ---
expectTypeOf<Dog>().toExtend<Animal>();
expectTypeOf<Cat>().toExtend<Animal>();

// --- (A) readonly array covariance (sound) & mutable↔readonly boundaries. ---

// readonly arrays are covariant: a readonly view of Dog[] is a readonly view of
// Animal[]. Sound, because nothing can be pushed into a readonly array.
expectTypeOf<readonly Dog[]>().toExtend<readonly Animal[]>();
// @ts-expect-error  readonly Animal[] is not a readonly Dog[] (wider element).
expectTypeOf<readonly Animal[]>().toExtend<readonly Dog[]>();

// A mutable Dog[] widens to a readonly Animal[] (you're giving UP write access):
expectTypeOf<Dog[]>().toExtend<readonly Animal[]>();
// @ts-expect-error  Can't narrow readonly Dog[] to a MUTABLE Animal[].
expectTypeOf<readonly Dog[]>().toExtend<Animal[]>();

// --- (B) A real call site that exercises function-param contravariance. ---

// `callVisitor` demands a callback that accepts ANY Animal. Only a callback
// whose parameter is at least as WIDE as Animal (Animal or wider) will do.
function callVisitor(visitor: (a: Animal) => void, subject: Dog): void {
  visitor(subject);
}

const dogOnly = (d: Dog): string => d.breed;
const anyAnimal = (a: Animal): string => a.kind;

// A Dog-only callback is too narrow — callVisitor might hand it a Cat:
// @ts-expect-error  (d: Dog) => void is not assignable to (a: Animal) => void.
callVisitor(dogOnly, new Dog());
// An Animal-accepting callback is fine — dogs ARE animals:
callVisitor(anyAnimal, new Dog());

// RUNTIME — drive the sound path end-to-end.
describe("callVisitor accepts a contravariant (wider) callback", () => {
  const seen: string[] = [];
  // This callback accepts Animal — it's assignable precisely BECAUSE Dog ⊆ Animal.
  const visit = (a: Animal): void => {
    seen.push(a.kind);
  };
  callVisitor(visit, new Dog());
  assert(seen.length === 1, "visitor should have been called once");
  assert(seen[0] === "animal", `expected kind "animal", got ${seen[0] ?? ""}`);
});

// 💡 Takeaways:
//   • `readonly Dog[]` → `readonly Animal[]` is covariance WITHOUT unsoundness.
//     Prefer `readonly` array types in signatures; they expose variance safely.
//   • `Dog[]` widens to `readonly Animal[]` but never to `Animal[]` (you can't
//     grant write access you didn't have).
//   • A callback parameter is a contravariant slot: pass a callback whose
//     parameter is WIDER than required, never narrower.
