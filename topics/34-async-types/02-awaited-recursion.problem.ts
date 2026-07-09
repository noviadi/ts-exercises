/**
 * PROMPT — Implement `Awaited<T>` from scratch
 *
 * `Awaited<T>` is the type-level mirror of how JavaScript resolves a promise:
 * it recursively unwraps promise/thenable layers until it bottoms out at a
 * non-thenable value. So:
 *
 *   Awaited<number>                 = number
 *   Awaited<Promise<number>>        = number
 *   Awaited<Promise<Promise<number>>> = number
 *   Awaited<number | Promise<string>> = number | string
 *
 * The pattern is a **recursive conditional type** with `infer`:
 *
 *   T extends ... ? <recurse> : T
 *
 * Your job:
 *   1. Implement `MyAwaited<T>` using only a conditional type with `infer`.
 *   2. Match the standard library `Awaited<T>` exactly across the cases below.
 *   3. Write a `Thenable` interface (`{ then: (...) => void }`) and prove that
 *      `MyAwaited` accepts a thenable-shaped type (mirroring runtime assimilation).
 *
 * Rules:
 *   - Use `infer U` to pull the element type out of a promise.
 *   - Recurse by calling `MyAwaited<…>` again inside the conditional.
 *
 * Run:  npx tsc --noEmit 02-awaited-recursion.problem.ts
 */

// TODO: implement MyAwaited.
// type MyAwaited<T> = ???;

import { expectTypeOf } from "@lib";

// CHECKS — should match the stdlib `Awaited<T>` exactly once implemented.

// expectTypeOf<MyAwaited<Promise<number>>>().toEqualTypeOf<number>();
// expectTypeOf<MyAwaited<Promise<Promise<number>>>>().toEqualTypeOf<number>();
// expectTypeOf<MyAwaited<number | Promise<string>>>().toEqualTypeOf<number | string>();
// expectTypeOf<MyAwaited<number>>().toEqualTypeOf<number>();
// expectTypeOf<MyAwaited<never>>().toEqualTypeOf<never>();
