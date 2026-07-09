/**
 * SOLUTION — `@log` and `@memo` method decorators (stage-3)
 *
 * Two big differences from the legacy `experimentalDecorators` world:
 *
 *   1. The context is a dedicated *object* (`ClassMethodDecoratorContext`),
 *      not a property descriptor. You read `ctx.name`, `ctx.kind`, etc.
 *   2. To **replace** a method you return a function; the runtime wires it in
 *      for you. There is no `descriptor.value = …` dance.
 *
 * The replacement function MUST preserve the call signature of the original.
 * We do this by giving the wrapper a generic `<...args: unknown[]>` rest and
 * `apply`-ing through `this`. For the type-system, the cleanest approach is to
 * type the wrapper as `(...args) => ReturnType<typeof target>` and let TS keep
 * the original signature on the class surface — because the *type* of the
 * decorated method comes from the class declaration, NOT from what the
 * decorator returns. (Decorators can only widen via `addInitializer`; they
 * cannot silently narrow signatures.)
 */

// explanation: the canonical generic wrapper. `F` is constrained to any
// function so we can call `target.apply` and forward `this` and args.
type AnyFn = (...args: any[]) => unknown;

// --- @log: log each call -------------------------------------------------
function log<F extends AnyFn>(
  target: F,
  ctx: ClassMethodDecoratorContext,
): F {
  // explanation: we return a function with the SAME type `F`. Inside we use
  // `this` (the instance) and forward args via `apply`. The `as F` cast is
  // necessary because TS can't prove the structural shape is identical.
  const wrapped = function (this: unknown, ...args: unknown[]) {
    const result = target.apply(this, args);
    // we keep the side-effect minimal per the kata's no-spam rule:
    console.log(`${String(ctx.name)}(${args.join(", ")}) -> ${String(result)}`);
    return result;
  } as F;
  return wrapped;
}

// --- @memo: cache by JSON-encoded args -----------------------------------
function memo<F extends AnyFn>(
  target: F,
  _ctx: ClassMethodDecoratorContext,
): F {
  const cache = new Map<string, unknown>();
  const wrapped = function (this: unknown, ...args: unknown[]) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = target.apply(this, args);
    cache.set(key, result);
    return result;
  } as F;
  return wrapped;
}

// --- @sealed: a CLASS decorator -----------------------------------------
// explanation: class decorators receive `(target: Function, ctx: ClassDecoratorContext)`.
// `target` is the class itself. Returning a value replaces the constructor;
// returning `void` (or `undefined`) keeps it.
//
// ⚠️ We must NOT seal synchronously inside the decorator body: the stage-3
// runtime assigns `Symbol.metadata` to the class AFTER the decorator returns,
// and `Object.seal` makes the constructor non-extensible — so the metadata
// assignment would then throw. The fix is `ctx.addInitializer`, whose
// callbacks run only AFTER the whole class (including its metadata bag) is
// finished. This is the general pattern for "do something post-definition".
function sealed(
  target: Function,
  ctx: ClassDecoratorContext,
): void {
  ctx.addInitializer(function () {
    Object.seal(target);
    Object.seal(target.prototype);
  });
}

class Calculator {
  @log
  square(n: number): number {
    return n * n;
  }

  @memo
  expensive(n: number): number {
    return n * 2 + 1;
  }
}

@sealed
class Settings {
  public theme = "dark";
}

import { assert, assertEquals, describe, expectTypeOf } from "@lib";

// CHECKS — the type of each method comes from the class declaration, so
// signatures are preserved automatically by the stage-3 type machinery.
expectTypeOf<Calculator["square"]>().toEqualTypeOf<(n: number) => number>();
expectTypeOf<Calculator["expensive"]>().toEqualTypeOf<(n: number) => number>();

// Runtime: verify behaviour of @log and @memo.
describe("@log wraps and forwards", () => {
  const c = new Calculator();
  assert(c.square(4) === 16, "square(4) === 16 through @log");
});

describe("@memo caches by argument signature", () => {
  let calls = 0;
  // a fresh class so we can count underlying invocations:
  class Counter {
    @memo
    run(n: number): number {
      calls += 1;
      return n * 10;
    }
  }
  const c = new Counter();
  assert(c.run(2) === 20, "first call computes");
  assert(c.run(2) === 20, "second call returns cached value");
  // explanation: we use `assertEquals` rather than `assert(calls === 1)` here
  // because `assert` is an `asserts` function — it would narrow the mutable
  // `calls` to the literal `1`, making the later `calls === 2` check report
  // "no overlap". `assertEquals` runs a runtime equality check WITHOUT
  // narrowing, which is what we want for a counter mutated through calls.
  assertEquals(calls, 1, "the underlying body ran exactly once");
  assert(c.run(3) === 30, "different arg recomputes");
  assertEquals(calls, 2, "two distinct cache entries -> two underlying calls");
});

describe("@sealed freezes the constructor and prototype", () => {
  assert(Object.isSealed(Settings), "Settings constructor is sealed");
  assert(Object.isSealed(Settings.prototype), "prototype is sealed");
});
