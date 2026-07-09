/**
 * PROMPT — `any` vs `unknown` (the safe top type)
 *
 * `any` is TypeScript's "I give up" switch: it disables checking in *both*
 * directions. `unknown` is its disciplined cousin: any value can be stored in
 * an `unknown`, but you CANNOT touch it until you've narrowed it.
 *
 * Tasks:
 *   1. Implement `lengthUnknown` so it typechecks WITHOUT `any`. You must prove
 *      to the compiler that `x` is a string before reading `.length`.
 *   2. Fix the CHECKS region: mark each `expectTypeOf` with the real
 *      relationship. Where the assertion is false, prefix it with
 *      `// @ts-expect-error  <reason>` instead of deleting it.
 *
 * Rules:
 *   - Do NOT use `any` anywhere in `lengthUnknown`.
 *   - Do not change the signatures of `lengthAny` / `lengthUnknown`.
 *
 * Run:  npx tsc --noEmit 01-any-vs-unknown.problem.ts
 */

// `any` opts out of checking — this compiles even though `x` is type `any`
// and may not have a `.length` at all. This is exactly the bug `any` hides.
function lengthAny(x: any): number {
  return x.length;
}

// `unknown` is the SAFE top: any value assigns in, but the compiler refuses to
// let you use it until you narrow.
function lengthUnknown(x: unknown): number {
  // TODO: narrow `x` with `typeof` and return its length, else return 0.
  // (No `any` allowed.)
  return 0;
}

import { expectTypeOf } from "@lib";

// CHECKS — fix these so they describe the truth about `any` and `unknown`.

// `any` is assignable to EVERYTHING (it is a top AND a bottom — it cheats):
expectTypeOf<any>().toExtend<string>();

// everything is assignable to `any` too:
expectTypeOf<string>().toExtend<any>();

// `unknown` is a true top: everything assigns INTO it:
expectTypeOf<string>().toExtend<unknown>();

// ❓ Can `unknown` itself be assigned to `string`? (Decide: keep or @ts-expect-error.)
expectTypeOf<unknown>().toExtend<string>();
