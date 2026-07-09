/**
 * PROMPT — `const` type parameters (`<const T>`)
 *
 * Forcing every caller to write `as const` is noisy. TypeScript 5.0 lets you
 * put `const` on a *type parameter*: the compiler then infers the narrowest
 * possible (literal/tuple) type at the call site, **without** the caller
 * writing `as const`.
 *
 *   declare function tuple<const T extends readonly unknown[]>(...xs: T): T;
 *   tuple("a", "b")   // T inferred as the literal tuple ["a","b"], no `as const`
 *
 * Your job:
 *   1. Add `const` to the type parameters of `tuple` and `pickLiteral` so the
 *      CHECKS compile (callers do NOT write `as const`).
 *   2. Leave the function bodies alone — only the signatures change.
 *
 * Run:  npx tsc --noEmit 02-const-type-params.problem.ts
 */

// TODO: add `const` to the type parameter so callers don't need `as const`.
function tuple<T extends readonly unknown[]>(...xs: T): T {
  return xs;
}

// TODO: same here — make `pickLiteral("open")` infer `"open"`, not `string`.
function pickLiteral<T>(value: T): T {
  return value;
}

import { expectTypeOf } from "@lib";

// CHECKS — callers do NOT write `as const`; inference must still be literal.
expectTypeOf(tuple("a", "b", "c")).toEqualTypeOf<readonly ["a", "b", "c"]>();
expectTypeOf(pickLiteral("open")).toEqualTypeOf<"open">();
expectTypeOf(pickLiteral(42)).toEqualTypeOf<42>();
