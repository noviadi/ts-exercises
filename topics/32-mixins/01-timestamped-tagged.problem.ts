/**
 * PROMPT — A Timestamped + Tagged mixin applied to a class
 *
 * JavaScript classes are single-inheritance. A **mixin** is a function that
 * takes a base class and returns a *new* class extending it, adding members.
 * The canonical TypeScript shape is:
 *
 *   type Mixin =
 *     <TBase extends new (...args: any[]) => Base>(Base: TBase) =>
 *       class extends Base { … };
 *
 * The `<TBase extends new (...args) => Base>` constraint is NOT just for show:
 * it preserves the *derived* class you passed in (so subclass statics and
 * `instanceof` keep working), instead of widening everything to `Base`.
 *
 * Your job:
 *   1. Implement `Timestamped` — a mixin that adds a readonly `createdAt: Date`.
 *   2. Implement `Tagged` — a mixin that adds a `tags: string[]` plus a
 *      `addTag(t: string)` method.
 *   3. Apply BOTH to `class User` via the `class Mixed extends Tagged(Timestamped(User)) {}`
 *      idiom, so that `const u = new Mixed()` has all three behaviours.
 *   4. Make the CHECKS pass.
 *
 * Rules:
 *   - Do NOT silence errors with `any` on the *public* surface.
 *   - The `any[]` in the constructor constraint is the one accepted `any`
 *     (forwarding unknown super-class args). Keep it.
 *
 * Run:  npx tsc --noEmit 01-timestamped-tagged.problem.ts
 */

// The shared base shape that everything ultimately extends.
class Base {
  public id = Math.random().toString(36).slice(2);
}

// TODO: implement the two mixins + the composed class below.

// HINT 1: a mixin's type parameter must be `TBase extends new (...args: any[]) => Base`.
// HINT 2: inside the returned class, `super(...args)` forwards to `Base`.
// HINT 3: to compose, do `class Mixed extends Tagged(Timestamped(Base)) {}`.

import { expectTypeOf } from "@lib";

// CHECKS — these fail until you implement everything above correctly.

// A mixed instance is still an `instanceof Base` (and of the composed mixins):
// expectTypeOf<InstanceType<typeof Mixed>>().toExtend<Base>();

// It also carries the createdAt field and the tags bag:
// expectTypeOf<InstanceType<typeof Mixed>>().toExtend<{
//   createdAt: Date;
//   tags: string[];
//   addTag: (t: string) => void;
// }>();
