/**
 * PROMPT — Optional chaining, nullish coalescing, truthiness
 *
 * Each of `?.`, `??`, and `if (x)` narrows types as a side-effect of its
 * runtime behaviour. Below are three small exercises. For each, replace the
 * `TODO` in the CHECKS with the EXACT narrowed type TS infers.
 *
 * Notes:
 *   - `??` only treats `null` / `undefined` as "missing" — NOT `0`/`""`/`false`.
 *   - `if (x)` strips every falsy member from the union (incl. `0`, `""`).
 *
 * Run:  npx tsc --noEmit 01-optional-chaining-nullish.problem.ts
 */

type Maybe = { value?: string | null };

declare const m: Maybe;
declare const num: number | null | undefined;
declare const str: string | "" | null | undefined;

const v = m.value?.toUpperCase();
const fallback = num ?? 42;

if (str) {
  // TODO: what is the narrowed type of `str` here?
}

import { expectTypeOf } from "@lib";

// CHECKS — replace each TODO with the precise narrowed type.
expectTypeOf<typeof v>().toEqualTypeOf<TODO>();               // ?. result
expectTypeOf<typeof fallback>().toEqualTypeOf<TODO>();        // ?? result
expectTypeOf<typeof str>().toEqualTypeOf<TODO>();             // inside `if (str)`
