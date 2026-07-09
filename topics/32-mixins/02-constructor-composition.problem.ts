/**
 * PROMPT — Type-level constructor composition
 *
 * Mixins are functions on *constructors*. Composing them is function
 * composition: `Tagged(Timestamped(Base))`. But we also want to reason about
 * the composition at the **type level** — to ask "what is the instance type of
 * a class built by chaining these mixins?".
 *
 * The key tools are the built-in utility types:
 *   - `ConstructorOf<T>`   — `(new (...args) => T)` — the constructor of T.
 *   - `InstanceType<C>`    — the instance type of a constructor type C.
 *   - `Mixin<TBase, Extra>` — a generic function type that takes a `TBase`
 *     constructor and returns one whose instances add `Extra`.
 *
 * Your job:
 *   1. Implement `Apply<C, Ms>` — given a base constructor `C` and a *tuple*
 *      of mixin-type-functions `[M1, M2, ...]`, compute the instance type of
 *      `M2(M1(C))`. (No need to compute the constructor itself — just its
 *      `InstanceType`.)
 *   2. Use it to derive `MixedInstance` for a 2-mixin composition, without
 *      writing the instance type by hand.
 *
 * Rules:
 *   - Pure type-level. No runtime needed.
 *   - Hint: model a mixin at the TYPE level as
 *       `<C extends ConstructorOf<Base>>() => ConstructorOf<Base & Extra>`
 *     — actually simpler: a mixin's *instance-type effect* is the function
 *       `InstanceType<C> => InstanceType<C> & Extra`. Compose by folding.
 *
 * Run:  npx tsc --noEmit 02-constructor-composition.problem.ts
 */

// We reuse the runtime mixin *values* and `Mixed` class from exercise 01's
// definitions (re-declared here in compact form so this file is standalone).
class Base {
  public id = "x";
}
type BaseCtor = new (...args: any[]) => Base;

// A type-level "shape contribution" each mixin makes to the instance.
type WithTimestamp = { createdAt: Date };
type WithTags = { tags: string[]; addTag: (t: string) => void };

// TODO: implement `Compose2` below — given a base instance type `B` and two
// "extras" `E1`, `E2`, return the composed instance type.
//
//   type Compose2<B, E1, E2> = ???;

import { expectTypeOf } from "@lib";

// CHECKS — should pass once `Compose2` is implemented.

// Composing Base with Timestamped then Tagged yields a structurally-identical
// type to the runtime Mixed class's instances:
// expectTypeOf<Compose2<Base, WithTimestamp, WithTags>>().toEqualTypeOf<
//   Base & WithTimestamp & WithTags
// >();
