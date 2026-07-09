/**
 * PROMPT — Build `Awaited<T>` step by step (recursion with `infer`)
 *
 * `Promise<Promise<T>>` is NOT `Promise<Promise<T>>` to `await` — JavaScript
 * promises flatten, so `await outerPromise` resolves to `T`, not `Promise<T>`.
 * TypeScript models this with the recursive `Awaited<T>` utility.
 *
 * Build it in two steps below:
 *
 *   Step 1 — `PeelOnce<T>`: unwrap ONE layer of Promise. `PeelOnce<Promise<X>>`
 *            is `X`; anything else is itself.
 *   Step 2 — `MyAwaited<T>`: unwrap RECURSIVELY so nested promises collapse
 *            all the way to the innermost value.
 *
 * Run:  npx tsc --noEmit 03-awaited-step.problem.ts
 */

// TODO: Step 1 — peel a single Promise layer.
type PeelOnce<T> = TODO;

// TODO: Step 2 — recurse until there is no Promise left.
type MyAwaited<T> = TODO;

// ---------------------------------------------------------------------------
// Fix the types above; the CHECKS below must compile once you do.
// ---------------------------------------------------------------------------

import { expectTypeOf } from "@lib";

type One = Promise<number>;
type Two = Promise<Promise<string>>;
type Three = Promise<Promise<Promise<boolean>>>;

// CHECKS — these fail until PeelOnce and MyAwaited are correct.
expectTypeOf<PeelOnce<One>>().toEqualTypeOf<number>();
expectTypeOf<MyAwaited<One>>().toEqualTypeOf<number>();
expectTypeOf<MyAwaited<Two>>().toEqualTypeOf<string>();
expectTypeOf<MyAwaited<Three>>().toEqualTypeOf<boolean>();
expectTypeOf<MyAwaited<number>>().toEqualTypeOf<number>();
