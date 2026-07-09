/**
 * PROMPT — readonly array covariance & a contravariant visitor
 *
 * Two short tasks:
 *
 *  A. Annotate the array relationships. `readonly` arrays are ALSO covariant
 *     (`readonly Dog[]` → `readonly Animal[]`), but this time it's SOUND,
 *     because the consumer can't push anything unsound into them.
 *
 *  B. `callVisitor` takes a visitor `(a: Animal) => void` and a `Dog`. Predict
 *     whether each call site compiles, then uncomment and annotate the ones
 *     that should be `@ts-expect-error`.
 *
 * Run:  npx tsc --noEmit 02-readonly-arrays-and-contravariance.problem.ts
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

// TODO: fix these checks so they describe reality.
import { expectTypeOf } from "@lib";

// expectTypeOf<readonly Dog[]>().toExtend<readonly Animal[]>();
// expectTypeOf<readonly Animal[]>().toExtend<readonly Dog[]>();
// expectTypeOf<Dog[]>().toExtend<readonly Animal[]>();
// expectTypeOf<readonly Dog[]>().toExtend<Animal[]>();

function callVisitor(visitor: (a: Animal) => void, subject: Dog): void {
  visitor(subject);
}

// TODO: uncomment each call site & annotate the errors.
// const dogOnly = (d: Dog) => console.log(d.breed);
// const anyAnimal = (a: Animal) => console.log(a.kind);
// callVisitor(dogOnly, new Dog());
// callVisitor(anyAnimal, new Dog());
