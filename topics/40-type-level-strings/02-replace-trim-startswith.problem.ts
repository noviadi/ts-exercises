/**
 * PROMPT — Replace, Trim, StartsWith
 *
 * Implement three string ops purely at the type level:
 *
 *   Replace<S, From, To>  — replace the FIRST occurrence of `From` with `To`.
 *     (Same semantics as `String.prototype.replace`, not `replaceAll`.)
 *     Guard the case `From = ""` so it returns `S` unchanged.
 *
 *   Trim<S>               — strip leading & trailing whitespace
 *     (space, tab, newline). Hint: define a `Whitespace` union and put it
 *     inside the template-literal pattern, then recurse.
 *
 *   StartsWith<S, P>      — a predicate: returns `true` if `S` begins with
 *     `P`, else `false`. Hint: `` S extends \`${P}${string}\` ``.
 *
 *     type Replace<S extends string, From extends string, To extends string> = any;  // TODO
 *     type Trim<S extends string> = any;        // TODO
 *     type StartsWith<S extends string, P extends string> = any;  // TODO
 *
 * Run:  npx tsc --noEmit 02-replace-trim-startswith.problem.ts
 */

import { expectTypeOf } from "@lib";

// TODO: implement Replace, Trim, StartsWith.
type Replace<
  S extends string,
  From extends string,
  To extends string,
> = any;
type Trim<S extends string> = any;
type StartsWith<S extends string, P extends string> = any;

// CHECKS — FAIL until all three are correct.

expectTypeOf<Replace<"hello world", "world", "TS">>().toEqualTypeOf<"hello TS">();
expectTypeOf<Replace<"a-b-c", "-", "+">>().toEqualTypeOf<"a+b-c">();
expectTypeOf<Replace<"no match", "x", "y">>().toEqualTypeOf<"no match">();
expectTypeOf<Replace<"abc", "", "X">>().toEqualTypeOf<"abc">();

expectTypeOf<Trim<"   hello   ">>().toEqualTypeOf<"hello">();
expectTypeOf<Trim<"\t\nhello\n\t">>().toEqualTypeOf<"hello">();
expectTypeOf<Trim<"hello">>().toEqualTypeOf<"hello">();
expectTypeOf<Trim<"   ">>().toEqualTypeOf<"">();

expectTypeOf<StartsWith<"hello world", "hello">>().toEqualTypeOf<true>();
expectTypeOf<StartsWith<"hello world", "world">>().toEqualTypeOf<false>();
expectTypeOf<StartsWith<"abc", "">>().toEqualTypeOf<true>();
expectTypeOf<StartsWith<"", "x">>().toEqualTypeOf<false>();
