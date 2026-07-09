/**
 * PROMPT — Intersection merge semantics
 *
 * `A & B` is "values that are BOTH A and B". For object types that means:
 * collect ALL required members; if the same key appears in both, the value
 * type is the INTERSECTION of the two value types (so identical types just
 * stay themselves).
 *
 * Below are two small record types. Your job:
 *   1. Define `Combined` as the intersection `HasId & HasName`.
 *   2. Fix the CHECKS so they describe what `Combined` actually looks like.
 *
 * Rules of the game:
 *   - Do NOT define `Combined` as a fresh object literal; use the `&` operator.
 *   - Reason about every check before filling it in.
 *
 * Run:  npx tsc --noEmit 01-merge-semantics.problem.ts
 */

type HasId = { id: number };
type HasName = { name: string };

// TODO: define `Combined` as the intersection of the two.
// type Combined = ???;

import { expectTypeOf } from "@lib";

// CHECKS — make these reflect reality.
// expectTypeOf<Combined>().toExtend<HasId>();        // ❓ satisfies HasId?
// expectTypeOf<Combined>().toExtend<HasName>();      // ❓ satisfies HasName?
// expectTypeOf<Combined>().toEqualTypeOf<{ id: number; name: string }>(); // ❓
