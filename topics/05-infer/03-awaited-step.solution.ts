/**
 * SOLUTION — Recursive `infer`: build `Awaited<T>`
 *
 * Promises flatten at runtime (`await new Promise<Promise<number>>(...)`
 * resolves to `number`, not `Promise<number>`). To type that, we need a
 * conditional type that keeps unwrapping until there's no `Promise` left —
 * i.e. a *recursive* conditional type.
 *
 *   Step 1 — `PeelOnce<T>` unwraps exactly one layer:
 *              PeelOnce<Promise<X>> = X, everything else = itself.
 *
 *   Step 2 — `MyAwaited<T>` calls ITSELF on the inner type until the
 *            `extends Promise<infer U>` match fails, then returns `T`:
 *
 *              MyAwaited<Promise<Promise<number>>>
 *                → MyAwaited<Promise<number>>      (matched once)
 *                → MyAwaited<number>               (matched again)
 *                → number                          (no more match → T)
 *
 * TypeScript evaluates this recursion at compile time and bottoms out as soon
 * as the condition is false, so it terminates for non-Promise inputs.
 */

// explanation: a single conditional. If T is shaped like `Promise<U>`, hand
// back U; otherwise hand back T untouched. Note `T` here is the *naked*
// parameter, so for unions this distributes — fine for our purposes, and the
// subject of Topic 07.
type PeelOnce<T> = T extends Promise<infer U> ? U : T;

// explanation: the recursive step. We `infer U` out of the Promise and then
// RECURSE on U. The recursion stops the moment T is not a Promise, returning T.
// TS supports this self-reference because the recursion is structurally
// decreasing (each step peels a Promise wrapper) and has a clear base case.
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T;

import { expectTypeOf } from "@lib";

type One = Promise<number>;
type Two = Promise<Promise<string>>;
type Three = Promise<Promise<Promise<boolean>>>;

// CHECKS — passing each one proves the recursion bottoms out correctly.

// One layer:
expectTypeOf<PeelOnce<One>>().toEqualTypeOf<number>();
expectTypeOf<MyAwaited<One>>().toEqualTypeOf<number>();
// Two layers — PeelOnce would stop at `Promise<string>`, MyAwaited reaches `string`:
expectTypeOf<MyAwaited<Two>>().toEqualTypeOf<string>();
// Three layers — fully collapsed:
expectTypeOf<MyAwaited<Three>>().toEqualTypeOf<boolean>();
// Non-Promise input is returned unchanged (base case of the recursion):
expectTypeOf<MyAwaited<number>>().toEqualTypeOf<number>();

// 💡 The real `Awaited<T>` in lib.d.ts is richer: it matches any *thenable*
//    (`{ then: (onfulfilled: ...) => unknown }`) rather than literally
//    `Promise<U>`, and special-cases `null`/`undefined`/`void`. But the
//    recursion shape — `T extends Container<infer U> ? recurse(U) : T` — is
//    identical to what we wrote here. Promise flattening *is* this recursion.
