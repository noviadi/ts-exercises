/**
 * SOLUTION — Replace, Trim, StartsWith
 *
 * Three more string ops built from the same two primitives:
 *   - template-literal `infer`, and
 *   - conditional-type recursion.
 *
 * Replace<S, From, To>
 *   Pattern-match the FIRST occurrence of `From` and swap it for `To`:
 *       S extends `${infer Before}${From}${infer After}`
 *         ? `${Before}${To}${After}`
 *         : S
 *   Edge case: if `From` is `""`, the pattern `${Before}${After}` matches the
 *   WHOLE string with `Before=""` and would splice `To` at the start — that's
 *   ambiguous, so we guard by returning `S` unchanged when `From extends ""`.
 *
 * Trim<S>
 *   Strip leading/trailing whitespace. We define a `Whitespace` union and put
 *   it inside the template literal: `` S extends \`${Whitespace}${infer Rest}\` ``.
 *   Recurse for left trim, then right trim, then compose.
 *
 * StartsWith<S, P>
 *   A pure predicate → returns `true | false`. `` S extends \`${P}${string}\` ``
 *   matches any string beginning with `P`.
 */

import { assert, describe, expectTypeOf } from "@lib";

// explanation: Replace the FIRST occurrence of `From` with `To`. We guard the
// empty-`From` case to avoid splicing `To` at position 0 (which would also
// loop forever if we recursed — but here we only replace once, like the
// runtime `String.prototype.replace`, not `replaceAll`).
type Replace<
  S extends string,
  From extends string,
  To extends string,
> = From extends ""
  ? S
  : S extends `${infer Before}${From}${infer After}`
    ? `${Before}${To}${After}`
    : S;

// explanation: a small whitespace union. Putting a union inside a template
// literal makes the conditional distribute over each whitespace char, so any
// of space / tab / newline is peeled in one step.
type Whitespace = " " | "\t" | "\n";

type TrimLeft<S extends string> = S extends `${Whitespace}${infer Rest}`
  ? TrimLeft<Rest>
  : S;

type TrimRight<S extends string> = S extends `${infer Rest}${Whitespace}`
  ? TrimRight<Rest>
  : S;

// explanation: compose right-trim then left-trim. (Order doesn't matter for
// correctness; trim both sides.)
type Trim<S extends string> = TrimLeft<TrimRight<S>>;

// explanation: a type-level predicate. `${P}${string}` matches any string that
// starts with `P`, where `string` is the wildcard "anything after".
type StartsWith<S extends string, P extends string> =
  S extends `${P}${string}` ? true : false;

// CHECKS — Replace.

expectTypeOf<Replace<"hello world", "world", "TS">>().toEqualTypeOf<"hello TS">();
expectTypeOf<Replace<"a-b-c", "-", "+">>().toEqualTypeOf<"a+b-c">();
expectTypeOf<Replace<"no match", "x", "y">>().toEqualTypeOf<"no match">();
expectTypeOf<Replace<"abc", "", "X">>().toEqualTypeOf<"abc">();
expectTypeOf<Replace<"", "x", "y">>().toEqualTypeOf<"">();
expectTypeOf<Replace<"aaa", "a", "b">>().toEqualTypeOf<"baa">();

// CHECKS — Trim.

expectTypeOf<Trim<"   hello   ">>().toEqualTypeOf<"hello">();
expectTypeOf<Trim<"\t\nhello\n\t">>().toEqualTypeOf<"hello">();
expectTypeOf<Trim<"hello">>().toEqualTypeOf<"hello">();
expectTypeOf<Trim<"">>().toEqualTypeOf<"">();
expectTypeOf<Trim<"   ">>().toEqualTypeOf<"">();
expectTypeOf<Trim<" a b ">>().toEqualTypeOf<"a b">();

// CHECKS — StartsWith.

expectTypeOf<StartsWith<"hello world", "hello">>().toEqualTypeOf<true>();
expectTypeOf<StartsWith<"hello world", "world">>().toEqualTypeOf<false>();
expectTypeOf<StartsWith<"abc", "">>().toEqualTypeOf<true>();
expectTypeOf<StartsWith<"", "">>().toEqualTypeOf<true>();
expectTypeOf<StartsWith<"", "x">>().toEqualTypeOf<false>();
expectTypeOf<StartsWith<"types.ts", ".ts">>().toEqualTypeOf<false>();
expectTypeOf<StartsWith<"types.ts", "types">>().toEqualTypeOf<true>();

// RUNTIME — JS equivalents, so we can see behaviour and confirm the types agree.
function replaceRuntime(s: string, from: string, to: string): string {
  // String.replace replaces only the FIRST match — same semantics as our type.
  return from === "" ? s : s.replace(from, to);
}
function trimRuntime(s: string): string {
  return s.trim();
}
function startsWithRuntime(s: string, p: string): boolean {
  return s.startsWith(p);
}

describe("02-replace-trim-startswith runtime checks", () => {
  assert(replaceRuntime("hello world", "world", "TS") === "hello TS");
  assert(replaceRuntime("a-b-c", "-", "+") === "a+b-c");
  assert(replaceRuntime("no match", "x", "y") === "no match");
  assert(replaceRuntime("abc", "", "X") === "abc", "empty From → unchanged");

  assert(trimRuntime("   hello   ") === "hello");
  assert(trimRuntime("\t\nhello\n\t") === "hello");
  assert(trimRuntime("hello") === "hello");

  assert(startsWithRuntime("hello world", "hello") === true);
  assert(startsWithRuntime("hello world", "world") === false);
  assert(startsWithRuntime("abc", "") === true, "empty prefix always matches");
});
