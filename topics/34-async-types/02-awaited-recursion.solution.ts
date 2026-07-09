/**
 * SOLUTION — Implement `Awaited<T>` from scratch
 *
 * The runtime resolution procedure for a promise is: "if the value is a
 * thenable, call its `then` and resolve to whatever that triggers; otherwise
 * use the value as-is." This is recursive — a thenable that resolves to
 * another thenable keeps unwrapping.
 *
 * We mirror it with a recursive conditional type. The whole body is just:
 *
 *   T extends Promise<infer U>      // is T a promise of something?
 *     ? MyAwaited<U>                  // yes -> recurse on the element
 *     : T                             // no  -> we've hit bedrock, return T
 *
 * Why this works for nesting:
 *   MyAwaited<Promise<Promise<number>>>
 *     -> Promise<Promise<number>> matches `Promise<infer U>` with U = Promise<number>
 *     -> MyAwaited<Promise<number>>
 *     -> matches again with U = number
 *     -> MyAwaited<number>
 *     -> number does NOT extend Promise<...>, so we stop and return `number`.
 *
 * Why it works for unions: conditional types are **distributive** over naked
 * type parameters, so `MyAwaited<A | B>` is computed as
 * `MyAwaited<A> | MyAwaited<B>` — exactly what we want.
 *
 * The stdlib `Awaited<T>` is essentially this same definition plus extra
 * machinery to recognise *thenable shapes* (objects with a `then` method), not
 * just `Promise<T>` literally. We replicate that with a second branch below.
 */

type MyAwaited<T> =
  // explanation: primary case — a real `Promise<infer U>`. We unwrap and recurse.
  T extends Promise<infer U>
    ? MyAwaited<U>
    : // explanation: secondary case — a generic THENABLE (duck-typed). At
      // runtime, `Promise.resolve(thenable)` assimilates any object with a
      // `then` method. The type system mirrors this: if `T` has a `then`
      // method whose first arg is called with a value of type `R`, we resolve
      // to `MyAwaited<R>`. The `extends (...args: any) => any` constraint
      // safely admits any thenable shape.
      T extends { then(onfulfilled: (value: infer R) => unknown): unknown }
        ? MyAwaited<R>
        : T;

// A bare thenable interface for the duck-typing test below.
interface Thenable<T> {
  then<R>(
    onfulfilled: (value: T) => R | Promise<R>,
  ): Thenable<Awaited<R>>;
}

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — `MyAwaited` must equal the stdlib `Awaited` across every shape.

expectTypeOf<MyAwaited<Promise<number>>>().toEqualTypeOf<number>();
expectTypeOf<MyAwaited<Promise<Promise<number>>>>().toEqualTypeOf<number>();
expectTypeOf<
  MyAwaited<Promise<Promise<Promise<number>>>>
>().toEqualTypeOf<number>();
expectTypeOf<
  MyAwaited<number | Promise<string>>
>().toEqualTypeOf<number | string>();
expectTypeOf<MyAwaited<number>>().toEqualTypeOf<number>();
expectTypeOf<MyAwaited<never>>().toEqualTypeOf<never>();
expectTypeOf<MyAwaited<void>>().toEqualTypeOf<void>();
expectTypeOf<MyAwaited<null>>().toEqualTypeOf<null>();
expectTypeOf<MyAwaited<number | undefined>>().toEqualTypeOf<number | undefined>();

// Parity with the stdlib across all the cases above:
expectTypeOf<MyAwaited<Promise<number>>>().toEqualTypeOf<Awaited<Promise<number>>>();
expectTypeOf<
  MyAwaited<Promise<Promise<number>>>
>().toEqualTypeOf<Awaited<Promise<Promise<number>>>>();
expectTypeOf<
  MyAwaited<number | Promise<string>>
>().toEqualTypeOf<Awaited<number | Promise<string>>>();

// Thenable duck-typing: a Thenable<number> is assimilated to `number`, just
// like a real Promise<number> would be. This mirrors the runtime: the Promise
// constructor does NOT check `instanceof Promise`; it only looks for a `then`.
expectTypeOf<MyAwaited<Thenable<number>>>().toEqualTypeOf<number>();

// Runtime demonstration of the actual flattening behaviour.
describe("runtime promise flattening mirrors Awaited<T>", async () => {
  // A function whose body returns a Promise that itself resolves to a Promise.
  // At runtime, `await` yields a flat number — there is no nesting.
  async function nested(): Promise<number> {
    return Promise.resolve(Promise.resolve(7));
  }
  const v = await nested();
  assert(v === 7, "Promise<Promise<number>> flattens to a bare 7 at runtime");

  // Promise.resolve assimilates a thenable, never wrapping it again:
  const thenable = { then: (cb: (n: number) => unknown) => cb(42) };
  const assimilated = await Promise.resolve(thenable);
  assert(assimilated === 42, "thenable was assimilated, not nested");
});
