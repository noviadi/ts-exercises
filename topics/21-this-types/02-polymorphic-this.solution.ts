/**
 * SOLUTION — Polymorphic `this` & F-bounded polymorphism
 *
 * `this` as a type resolves to "the most derived class at the call site". So a
 * method declared to return `this` on `Builder` will return `SubBuilder` when
 * called on a `SubBuilder`, with no cast. This is what makes fluent/chained
 * APIs type-safe: each link preserves the concrete subclass.
 *
 *   class Builder  { set(k: string, v: unknown): this { ...; return this; } }
 *   class SubBuilder extends Builder { font(f: string): this { ... } }
 *
 *   new SubBuilder().set("a", 1).font("mono")   // both calls are SubBuilder
 *
 * F-bounded polymorphism is the related pattern `class C<T extends C<T>>`,
 * which lets a base class reference "the subclass type" in type positions
 * (not just as a return). It's heavier and only needed when the subclass type
 * must flow into OTHER generic positions (e.g. a `compare(other: T)` method).
 * For pure chaining, polymorphic `this` is simpler and preferred.
 */

class Builder {
  // explanation: store options without leaking the index signature to callers.
  // We keep this internal so the public surface stays narrow.
  protected opts: Record<string, unknown> = {};

  // explanation: returning `this` (not `Builder`) means a SubBuilder's `set`
  // returns SubBuilder — polymorphic resolution at the call site.
  set(key: string, value: unknown): this {
    this.opts[key] = value;
    return this;
  }
}

class SubBuilder extends Builder {
  // explanation: `set` already returns `this`, so we can delegate and the
  // result is still `this` (= SubBuilder when called on one).
  font(f: string): this {
    return this.set("font", f);
  }
}

// explanation: an F-bounded example, for contrast. `Entity<T extends Entity<T>>`
// lets `compare` require the SAME subclass. Use only when you need the subclass
// type in a parameter or other generic slot — not for plain chaining.
class Entity<T extends Entity<T>> {
  constructor(readonly id: number) {}
  // 'other' must be the same concrete subclass, thanks to the bound:
  sameId(other: T): boolean {
    return this.id === other.id;
  }
}
// explanation: each subclass adds a DISTINGUISHING field so they are NOT
// structurally identical — otherwise `sameId` would accept the wrong subclass
// (structural typing would let an OrderEntity stand in for a UserEntity).
class UserEntity extends Entity<UserEntity> {
  constructor(id: number, readonly name: string) {
    super(id);
  }
}
class OrderEntity extends Entity<OrderEntity> {
  constructor(id: number, readonly total: number) {
    super(id);
  }
}

import { assert, describe, expectTypeOf } from "@lib";

const b = new SubBuilder();

// CHECKS — `this` resolves to the concrete subclass, so chaining typechecks.

// `b.set(...)` returns `SubBuilder` (polymorphic this), not the wider `Builder`:
expectTypeOf(b.set("a", 1)).toEqualTypeOf<SubBuilder>();
expectTypeOf(b.set("a", 1)).toExtend<Builder>();

// Chained calls stay SubBuilder all the way down:
expectTypeOf(b.set("a", 1).font("mono")).toEqualTypeOf<SubBuilder>();

// A plain `Builder` (not the subclass) returns `Builder` from `set`:
const base = new Builder();
expectTypeOf(base.set("x", 1)).toEqualTypeOf<Builder>();

// F-bounded checks: sameId requires matching subclasses.
const u1 = new UserEntity(1, "a");
const u2 = new UserEntity(1, "b");
const o1 = new OrderEntity(1, 99);
assert(u1.sameId(u2) === true, "users compare by id");
// @ts-expect-error  OrderEntity is missing `name` — not assignable to UserEntity.
u1.sameId(o1);

describe("fluent builder runtime behaviour", () => {
  const built = new SubBuilder().set("width", 10).font("mono");
  assert(built instanceof SubBuilder, "result is a SubBuilder");
  assert((built as unknown as { opts: Record<string, unknown> }).opts["width"] === 10, "width stored");
});

// 💡 Takeaways:
//   • Return `this` from base-class methods to keep fluent chains typed at the
//     concrete subclass — no casts required.
//   • Reach for F-bounded `class C<T extends C<T>>` only when the subclass type
//     must appear in a parameter or nested generic position (rare).
//   • `this` resolves at the CALL SITE, so the same method signature serves
//     every subclass automatically.
