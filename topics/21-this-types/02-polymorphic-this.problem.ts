/**
 * PROMPT — Polymorphic `this` & F-bounded polymorphism
 *
 * The polymorphic `this` type means "whatever the current concrete class is".
 * Returning `this` from a base-class method lets a SUBCLASS keep its own type
 * through the chain — the foundation of fluent builders and the F-bounded
 * `class Base<T extends Base<T>>` pattern.
 *
 * Below is a `Builder` base class with a `set<T>` method stubbed to return
 * `Builder` (too wide) and a `SubBuilder` subclass that adds a `font()`
 * method. The goal: after `set(...)` on a `SubBuilder`, you should STILL have
 * a `SubBuilder` so `.font(...)` chains without a cast.
 *
 * Your job:
 *   1. Change `Builder.set` to return `this` (polymorphic) instead of `Builder`.
 *   2. Add the missing CHECKS so the chaining typechecks AND the no-cast
 *      invariant is captured.
 *
 * Rules of the game:
 *   - Do NOT cast anywhere.
 *   - The runtime body stays the same (return the mutated object).
 *
 * Run:  npx tsc --noEmit 02-polymorphic-this.problem.ts
 */

class Builder {
  private opts: Record<string, unknown> = {};

  // TODO: change this return type to `this` (and the declared return).
  set(key: string, value: unknown): Builder {
    this.opts[key] = value;
    return this;
  }
}

class SubBuilder extends Builder {
  font(f: string): this {
    return this.set("font", f);
  }
}

import { expectTypeOf } from "@lib";

const b = new SubBuilder();

// CHECKS — these should compile without casts once `set` returns `this`.
// expectTypeOf(b.set("a", 1)).toExtend<SubBuilder>(); // ❓ uncomment + fix
// expectTypeOf(b.set("a", 1).font("mono")).toExtend<SubBuilder>(); // ❓
