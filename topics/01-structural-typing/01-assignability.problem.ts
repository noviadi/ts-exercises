/**
 * PROMPT — Structural assignability
 *
 * TypeScript compares types by *shape*, not by name. Below are several pairs of
 * types. Fix the `expectTypeOf` checks in the CHECKS region by choosing, for
 * each, whether `A` is assignable-to `B` (`toExtend`) or whether `A` and
 * `B` are *identical* (`toEqualTypeOf`).
 *
 * Rules of the game:
 *   - Do NOT change the type definitions of `User` / `NamedUser` / `Empty`.
 *   - Only change the assertions so they describe the TRUE relationship
 *     (add `// @ts-expect-error` + a note where the answer is "not assignable").
 *   - Reason first, then make the assertion match your reasoning.
 *
 * Run:  npx tsc --noEmit 01-assignability.problem.ts
 */

type User = { name: string; age: number };
type NamedUser = { name: string };
type Empty = {};

// TODO: decide each relationship and fix the assertions below.

import { expectTypeOf } from "@lib";

// CHECKS — make these reflect reality.
expectTypeOf<User>().toExtend<NamedUser>(); // ❓ User is assignable to NamedUser?
expectTypeOf<NamedUser>().toExtend<User>(); // ❓ NamedUser assignable to User?
expectTypeOf<User>().toEqualTypeOf<{ name: string; age: number }>(); // ❓ identical?
expectTypeOf<User>().toExtend<Empty>(); // ❓ the famous "empty type" trap
