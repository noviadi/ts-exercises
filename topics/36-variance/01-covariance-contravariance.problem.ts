/**
 * PROMPT — Covariance vs contravariance
 *
 * We have a tiny hierarchy: `Dog extends Animal`. The questions are all of the
 * form "is X assignable to Y?" — for arrays and for functions.
 *
 * Your job:
 *   1. Read each `expectTypeOf` line. Predict: does it compile (relationship
 *      holds) or is it an error?
 *   2. Uncomment every line. For the lines that describe a FALSE relationship,
 *      put `// @ts-expect-error  <reason>` directly above them. Delete or fix
 *      any line whose assertion is the wrong direction.
 *
 * Reminder of the rules under the strict tsconfig in this repo
 * (`strictFunctionTypes: true`):
 *   - Arrays are COVARIANT:            Dog[]  assignable to Animal[]
 *   - Function params are CONTRAVARIANT: see step 2 to discover the direction.
 *   - Method shorthand is BIVARIANT.
 *
 * Run:  npx tsc --noEmit 01-covariance-contravariance.problem.ts
 */

class Animal {
  kind = "animal";
}
class Dog extends Animal {
  breed = "labrador";
}

import { expectTypeOf } from "@lib";

// CHECKS — uncomment & annotate each.

// --- Covariance of arrays ---
// expectTypeOf<Dog[]>().toExtend<Animal[]>();
// expectTypeOf<Animal[]>().toExtend<Dog[]>();

// --- Contravariance of function parameters (strictFunctionTypes) ---
// expectTypeOf<(x: Dog) => void>().toExtend<(x: Animal) => void>();
// expectTypeOf<(x: Animal) => void>().toExtend<(x: Dog) => void>();

// --- Method shorthand is bivariant ---
type VisitorMethod = { visit(x: Animal): void };
// expectTypeOf<{ visit(x: Dog): void }>().toExtend<VisitorMethod>();
// expectTypeOf<VisitorMethod>().toExtend<{ visit(x: Dog): void }>();
