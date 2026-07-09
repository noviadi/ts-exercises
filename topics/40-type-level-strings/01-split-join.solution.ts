/**
 * SOLUTION — Split<S, D> and Join<T, D>
 *
 * Template-literal types let us peel characters off a string with `infer`.
 * The core pattern — splitting on the FIRST occurrence of a delimiter — is:
 *
 *     S extends `${infer Head}${D}${infer Tail}` ? ... : ...
 *
 *   - `Head` binds everything before the first `D`.
 *   - `Tail` binds everything after the first `D`.
 *   - If `D` does NOT occur, the whole pattern fails and we hit the `else`
 *     branch (which is how recursion terminates: return the leftover as a
 *     one-element tuple).
 *
 * Recursive Split just keeps peeling `Tail` until no delimiter remains:
 *
 *     Split<"a,b,c", ",">
 *       → [Head="a", Tail="b,c"] → ["a", ...Split<"b,c", ",">]
 *       → [Head="b", Tail="c"]   → ["b", ...Split<"c", ",">]
 *       → "c" has no "," → ["c"]
 *       → ["a", "b", "c"]
 *
 * Join is the inverse: pattern-match on the tuple with a variadic spread.
 */

import { assertEquals, describe, expectTypeOf } from "@lib";

// explanation: peel off `Head` before the first `D` and recurse on `Tail`.
// When no `D` remains, the pattern fails → return `[S]` (the last segment).
//
// Edge case — EMPTY delimiter (`D = ""`): the pattern
// `${infer Head}${D}${infer Tail}` collapses to `${infer Head}${infer Tail}`,
// which would never terminate (Tail can keep being ""). So we special-case
// `D extends ""`: split the string into individual characters instead.
//   - Split<"a", "">      → ["a"]
//   - Split<"abc", "">    → ["a", "b", "c"]
//   - Split<"a,b", ",">   → ["a", "b"]
//   - Split<"abc", ",">   → ["abc"]  (no delimiter → whole string as one segment)
//   - Split<"", ",">      → [""]     (empty input → one empty segment)
type Split<S extends string, D extends string> = D extends ""
  ? S extends `${infer First}${infer Rest}`
    ? [First, ...Split<Rest, "">]
    : []
  : S extends `${infer Head}${D}${infer Tail}`
    ? [Head, ...Split<Tail, D>]
    : [S];

// explanation: pattern-match on the tuple. A tuple `[First, ...Rest]` lets us
// take the head element and recurse on the rest. The recursion terminates when
// the tuple is empty → return "".
//   - We constrain the inferred elements to `string` inline
//     (`infer First extends string`) so Join refuses non-string tuples.
type Join<T extends readonly string[], D extends string> =
  T extends readonly [infer First extends string, ...infer Rest extends string[]]
    ? Rest extends []
      ? First
      : `${First}${D}${Join<Rest, D>}`
    : "";

// CHECKS — Split.

expectTypeOf<Split<"a,b,c", ",">>().toEqualTypeOf<["a", "b", "c"]>();
expectTypeOf<Split<"hello", ",">>().toEqualTypeOf<["hello"]>();
expectTypeOf<Split<"a-b-c", "-">>().toEqualTypeOf<["a", "b", "c"]>();
expectTypeOf<Split<"", ",">>().toEqualTypeOf<[""]>();
expectTypeOf<Split<"a", "">>().toEqualTypeOf<["a"]>();
expectTypeOf<Split<"abc", "">>().toEqualTypeOf<["a", "b", "c"]>();
expectTypeOf<Split<"a,b,", ",">>().toEqualTypeOf<["a", "b", ""]>();

// CHECKS — Join.

expectTypeOf<Join<["a", "b", "c"], ",">>().toEqualTypeOf<"a,b,c">();
expectTypeOf<Join<["a", "b", "c"], "-">>().toEqualTypeOf<"a-b-c">();
expectTypeOf<Join<["only"], ",">>().toEqualTypeOf<"only">();
expectTypeOf<Join<[], ",">>().toEqualTypeOf<"">();
expectTypeOf<Join<["x", "y"], "">>().toEqualTypeOf<"xy">();
expectTypeOf<Join<["a", "b", "c"], ".">>().toEqualTypeOf<"a.b.c">();

// Join over a Split is identity (round-trip), as long as the delimiter has no
// regex-special meaning at the type level:
expectTypeOf<Join<Split<"a,b,c", "," >, ",">>().toEqualTypeOf<"a,b,c">();

// RUNTIME — mirror the type-level ops with real JS so we can see the behaviour
// and prove the two agree. A type is only as good as the runtime it describes.
function splitRuntime(s: string, d: string): string[] {
  return s.split(d);
}
function joinRuntime(parts: readonly string[], d: string): string {
  return parts.join(d);
}

describe("01-split-join runtime checks", () => {
  assertEquals(splitRuntime("a,b,c", ","), ["a", "b", "c"]);
  assertEquals(splitRuntime("abc", ","), ["abc"]);
  assertEquals(splitRuntime("", ","), [""]);
  assertEquals(joinRuntime(["a", "b", "c"], ","), "a,b,c");
  assertEquals(joinRuntime([], ","), "");
  assertEquals(joinRuntime(["only"], ","), "only");
});
