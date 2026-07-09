/**
 * PROMPT — The `this:` parameter
 *
 * A `this` parameter is a *type-only* (erased at runtime) first parameter
 * that constrains what kind of object the function may be called on. It is the
 * canonical fix for "this method grabbed the wrong receiver" bugs.
 *
 * Below, `toUpperCase` is a free function meant to run as a method of objects
 * with a `value: string` field. Without a `this:` parameter, TS treats `this`
 * as `any` (under `noImplicitThis`) or `unknown` — letting bugs slip through.
 *
 * Your job:
 *   1. Add a `this:` parameter to `toUpperCase` that requires `{ value: string }`.
 *   2. Fix the CHECKS to reflect what's now safe vs what now errors.
 *
 * Rules of the game:
 *   - Do not change the runtime body.
 *   - Add `// @ts-expect-error` + a note ONLY where calling it the wrong way
 *     now genuinely errors.
 *
 * Run:  npx tsc --noEmit 01-this-parameter.problem.ts
 */

type HasValue = { value: string };

// TODO: add a `this:` parameter so this can only be called on a `HasValue`.
function toUpperCase(): string {
  return this.value.toUpperCase();
}

import { expectTypeOf } from "@lib";

const ok: HasValue = { value: "hi" };
const wrong = { kind: "x" };

// CHECKS — make these reflect reality after you add the `this:` parameter.

// Calling `toUpperCase.call(ok)` should compile:
toUpperCase.call(ok); // ❓

// Calling `toUpperCase.call(wrong)` should error (wrong has no `value`):
// toUpperCase.call(wrong); // ❓ add @ts-expect-error here once it errors
