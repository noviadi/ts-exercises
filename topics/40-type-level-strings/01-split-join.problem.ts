/**
 * PROMPT — Split<S, D> and Join<T, D>
 *
 * Implement two inverse operations, purely at the type level:
 *
 *   Split<S, D>  — split string `S` on every occurrence of delimiter `D`,
 *                  returning a tuple of segments.
 *   Join<T, D>   — join a tuple of strings `T` with delimiter `D`,
 *                  returning a single string.
 *
 * Building blocks:
 *   - Template-literal `infer`:
 *       S extends `${infer Head}${D}${infer Tail}` ? ... : ...
 *     binds `Head`/`Tail` around the FIRST `D`. When no `D` is present the
 *     pattern fails → use this as your recursion's base case.
 *   - Variadic tuple `infer`:
 *       T extends [infer First, ...infer Rest] ? ... : ...
 *     peels the head element and recurses on the rest.
 *
 *     type Split<S extends string, D extends string> = any;  // TODO
 *     type Join<T extends readonly string[], D extends string> = any;  // TODO
 *
 * Run:  npx tsc --noEmit 01-split-join.problem.ts
 */

import { expectTypeOf } from "@lib";

// TODO: implement Split and Join.
type Split<S extends string, D extends string> = any;
type Join<T extends readonly string[], D extends string> = any;

// CHECKS — FAIL until both are correct.

expectTypeOf<Split<"a,b,c", ",">>().toEqualTypeOf<["a", "b", "c"]>();
expectTypeOf<Split<"hello", ",">>().toEqualTypeOf<["hello"]>();
expectTypeOf<Split<"", ",">>().toEqualTypeOf<[""]>();
expectTypeOf<Split<"abc", "">>().toEqualTypeOf<["a", "b", "c"]>();

expectTypeOf<Join<["a", "b", "c"], ",">>().toEqualTypeOf<"a,b,c">();
expectTypeOf<Join<["only"], ",">>().toEqualTypeOf<"only">();
expectTypeOf<Join<[], ",">>().toEqualTypeOf<"">();
