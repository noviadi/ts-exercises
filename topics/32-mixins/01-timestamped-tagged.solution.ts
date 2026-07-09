/**
 * SOLUTION — A Timestamped + Tagged mixin applied to a class
 *
 * A mixin is a generic function: given *any* subclass of `Base`, return a new
 * class extending THAT subclass. The shape:
 *
 *   <TBase extends new (...args: any[]) => Base>(Base: TBase) =>
 *     class extends Base { … }
 *
 * Why `TBase extends new (...args) => Base` rather than just `Base: typeof Base`?
 *   - If we wrote `Base: typeof Base`, the returned class would extend `Base`
 *     itself, and TS would lose track of whatever *subclass* you actually
 *     passed in. The generic `TBase` captures the concrete subclass and threads
 *     it through `extends Base`, so static members and downstream `instanceof`
 *     checks keep working.
 *   - `new (...args: any[]) => Base` is the "constructable subtype of Base"
 *     constraint. The `any[]` for args is the accepted exception: we cannot
 *     know the supertype's constructor signature ahead of time, so we forward
 *     a rest tuple blindly.
 */

// The shared base shape that everything ultimately extends.
class Base {
  public id = Math.random().toString(36).slice(2);
}

// explanation: `Mixin<TBase>` is generic over the subclass of Base we receive.
// `class extends Base` (the *value* Base) is what makes the runtime prototype
// chain correct; `extends Base` (the *type* constraint) is what makes TS aware
// of the inherited members.
type BaseCtor = new (...args: any[]) => Base;

// --- Mixin 1: Timestamped ------------------------------------------------
function Timestamped<TBase extends BaseCtor>(Base: TBase) {
  return class Timestamped extends Base {
    // explanation: assigned in the constructor body so it is definitely set
    // before any method can read it (satisfies strict property-initialization).
    public readonly createdAt: Date;

    constructor(...args: any[]) {
      super(...args);
      this.createdAt = new Date();
    }
  };
}

// --- Mixin 2: Tagged -----------------------------------------------------
function Tagged<TBase extends BaseCtor>(Base: TBase) {
  return class Tagged extends Base {
    public tags: string[] = [];

    public addTag(tag: string): void {
      this.tags.push(tag);
    }
  };
}

// explanation: composing mixins is just nesting them. The OUTER mixin's
// `super` is the class returned by the inner mixin, which itself `super`s
// `Base`. We give the resulting anonymous class a name (`Mixed`) so that
// `InstanceType<typeof Mixed>` is a clean handle for the instance type.
class Mixed extends Tagged(Timestamped(Base)) {}

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — compile-time shape of a mixed instance.

// A mixed instance is still an `instanceof Base`:
expectTypeOf<InstanceType<typeof Mixed>>().toExtend<Base>();

// It also carries the createdAt field and the tags bag:
expectTypeOf<InstanceType<typeof Mixed>>().toExtend<{
  createdAt: Date;
  tags: string[];
  addTag: (t: string) => void;
}>();

// `typeof Mixed` (the constructor side) is constructible with zero args —
// i.e. `new Mixed()` is legal. (Note we use `typeof Mixed`, the constructor
// type, not `Mixed` the instance type.)
expectTypeOf<typeof Mixed>().toBeConstructibleWith();

// Runtime sanity check: behaviour actually wires up through the chain.
describe("Timestamped+Tagged mixin behaviour", () => {
  const u = new Mixed();
  assert(u.id.length > 0, "inherited Base.id should be set");
  assert(u.createdAt instanceof Date, "Timestamped added createdAt");
  assert(Array.isArray(u.tags), "Tagged added tags=[]");
  u.addTag("admin");
  u.addTag("eu");
  assert(u.tags.length === 2, "addTag mutated the tags bag");
  assert(u instanceof Base, "instanceof Base still works through mixins");
});
