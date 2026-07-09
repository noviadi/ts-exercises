/**
 * SOLUTION — Typing an async function's return
 *
 * The runtime rule and the type-level rule are the SAME rule, mirrored:
 *
 *   RUNTIME:  `async` wraps the body's eventual value in a single Promise. If
 *             the body itself returns a Promise (or a thenable), the outer
 *             Promise adopts it ("assimilation"). The result never nests.
 *
 *   TYPES:    the inferred return type of `async () => B` is `Promise<Awaited<B>>`,
 *             where `Awaited<B>` recursively unwraps any promise layers in `B`.
 *
 * So:
 *   AsyncReturn<number>                 = Promise<number>
 *   AsyncReturn<Promise<number>>        = Promise<number>   (flattened)
 *   AsyncReturn<Promise<Promise<number>>> = Promise<number> (still flattened)
 *   AsyncReturn<void>                   = Promise<void>
 *   AsyncReturn<number | Promise<string>> = Promise<number | string>
 *
 * Note for `exactOptionalPropertyTypes` users: `Promise<void>` is NOT
 * `Promise<undefined>` — the void element means "I will resolve, ignore the
 * value". That distinction matters when you `await` and try to use the result.
 */

// explanation: `Awaited<B>` already does the recursive unwrap (see exercise 02
// for a from-scratch implementation). Wrapping the result back in `Promise<>`
// gives us exactly what an `async` function's signature collapses to.
type AsyncReturn<B> = Promise<Awaited<B>>;

async function returnsNumber(): Promise<number> {
  return 7;
}
// explanation: NO explicit return annotation here — we let TS infer, to show
// the flattening. The body returns a `Promise<Promise<number>>`, but TS infers
// `Promise<number>` for the function (Awaited unwraps the nested layers).
async function returnsNested() {
  return Promise.resolve(Promise.resolve(7));
}
async function returnsVoid(): Promise<void> {}
async function returnsBareValue(): Promise<number> {
  return 42;
}

import { assert, describe, expectTypeOf } from "@lib";

// CHECKS — compile-time.

// The utility type matches TS's own async inference for every shape of body:
expectTypeOf<AsyncReturn<number>>().toEqualTypeOf<Promise<number>>();
expectTypeOf<AsyncReturn<Promise<number>>>().toEqualTypeOf<Promise<number>>();
expectTypeOf<
  AsyncReturn<Promise<Promise<number>>>
>().toEqualTypeOf<Promise<number>>();
expectTypeOf<AsyncReturn<void>>().toEqualTypeOf<Promise<void>>();
expectTypeOf<
  AsyncReturn<number | Promise<string>>
>().toEqualTypeOf<Promise<number | string>>();

// Real async functions infer exactly what `AsyncReturn` predicts:
expectTypeOf<ReturnType<typeof returnsNumber>>().toEqualTypeOf<Promise<number>>();
expectTypeOf<ReturnType<typeof returnsVoid>>().toEqualTypeOf<Promise<void>>();
// The unannotated `returnsNested` body produces `Promise<Promise<number>>`,
// yet TS INFERS `Promise<number>` — flattening during inference:
expectTypeOf<
  ReturnType<typeof returnsNested>
>().toEqualTypeOf<Promise<number>>();
expectTypeOf<
  ReturnType<typeof returnsBareValue>
>().toEqualTypeOf<Promise<number>>();

// Runtime sanity checks: awaiting these yields the unwrapped element.
describe("async functions resolve to their awaited element", async () => {
  assert((await returnsNumber()) === 7, "returnsNumber resolves to 7");
  assert((await returnsBareValue()) === 42, "returnsBareValue resolves to 42");
  assert(
    (await returnsNested()) === 7,
    "nested-promise-returning async still resolves to a flat 7",
  );
  assert(
    (await returnsVoid()) === undefined,
    "void-returning async resolves to undefined",
  );
});
