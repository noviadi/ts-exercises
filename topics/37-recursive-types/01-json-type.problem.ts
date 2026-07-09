/**
 * PROMPT — The recursive `Json` type
 *
 * JSON values are strings, numbers, booleans, null, arrays of JSON, or objects
 * whose every property is itself JSON. That "itself" is what makes the type
 * recursive.
 *
 * Your job:
 *   1. Replace the `unknown` members of `Json` with the correct primitive
 *      branches AND the two recursive branches (array + object).
 *   2. Make the CHECKS compile (an `@ts-expect-error` is needed on the last one
 *      — figure out why).
 *
 * Hint — the object branch uses an index signature:
 *     { [key: string]: Json }
 *
 * Run:  npx tsc --noEmit 01-json-type.problem.ts
 */

// TODO: fill in the recursive members.
type Json = string | number | boolean | null | unknown | unknown;

import { expectTypeOf } from "@lib";

// CHECKS
expectTypeOf<Json>().toExtend<string | number | boolean | null | Json[] | { [k: string]: Json }>();

// A plain JS object literal whose values are all Json IS a Json:
expectTypeOf<{ name: string; age: number }>().toExtend<Json>();

// ...but a function is NOT a Json — annotate the error.
// expectTypeOf<() => void>().toExtend<Json>();
