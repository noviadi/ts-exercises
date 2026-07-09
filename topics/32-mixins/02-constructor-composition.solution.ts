/**
 * SOLUTION — Type-level constructor composition
 *
 * Two views of a mixin:
 *
 *   1. VALUE-level:   `Mixin = <TBase extends BaseCtor>(Base) => class extends Base {…}`
 *   2. TYPE-level:    a mixin maps a base *instance type* to a richer one:
 *
 *        type MixinEffect<B> = B & Extra
 *
 * Composing mixins is then just *intersection accumulation*: applying mixins
 * M1 then M2 to a base `B` produces `B & E1 & E2`. Intersection is
 * commutative & associative for object types, so the *type* of the result is
 * independent of order — even though the *runtime* `super` chain is not.
 *
 * The accompanying utility types you should internalise:
 *   - `ConstructorOf<T>`   — `new (...args: any[]) => T`
 *   - `InstanceType<C>`    — extracts the instance type a constructor produces
 *   - `Intersection`       — `(U extends any ? (x: U) => void : never) extends
 *                            ((x: infer I) => void) ? I : never` (the standard
 *                            "union-to-intersection" trick).
 */

class Base {
  public id = "x";
}
// explanation: this constructor-type alias is the type-level handle for "any
// class whose instances extend Base". `any[]` for args is the accepted escape
// hatch (see exercise 01): we cannot know the supertype's ctor signature.
type BaseCtor = new (...args: any[]) => Base;

type WithTimestamp = { createdAt: Date };
type WithTags = { tags: string[]; addTag: (t: string) => void };

// The TYPE-level composition. Each mixin contributes an `Extra` that gets
// intersected onto the base instance type. Two extras:
//   Compose2<B, E1, E2> = B & E1 & E2
type Compose2<B, E1, E2> = B & E1 & E2;

// explanation: the same idea scales to a tuple of extras via a fold:
//   type Compose<B, Es extends readonly unknown[]> =
//     Es extends [infer E, ...infer Rest]
//       ? Compose<B & E, Rest>
//       : B;
// (Left as a comment — the two-extra form is enough for the assertion below.)

// Bonus — a type-level *constructor* for the composed instance, derived purely
// from the base constructor and the extras:
type ComposedCtor<B, E1, E2> =
  // take any constructor of B…
  (BaseCtor) extends infer C
    ? // …and redefine its instance type via intersection.
      new (...args: any[]) => B & E1 & E2
    : never;

import { expectTypeOf } from "@lib";

// CHECKS — compile-time only; no runtime needed for this type-level exercise.

// Composing Base with Timestamped then Tagged yields a structurally-identical
// type to a hand-written intersection:
expectTypeOf<Compose2<Base, WithTimestamp, WithTags>>().toEqualTypeOf<
  Base & WithTimestamp & WithTags
>();

// Order of intersection does not change identity for object types:
expectTypeOf<Compose2<Base, WithTags, WithTimestamp>>().toEqualTypeOf<
  Compose2<Base, WithTimestamp, WithTags>
>();

// The composed constructor's InstanceType is exactly the composed instance:
expectTypeOf<
  InstanceType<ComposedCtor<Base, WithTimestamp, WithTags>>
>().toExtend<Base & WithTimestamp & WithTags>();

// A composed instance really does have all three contributions:
expectTypeOf<Compose2<Base, WithTimestamp, WithTags>>().toExtend<{
  id: string;
  createdAt: Date;
  tags: string[];
  addTag: (t: string) => void;
}>();
