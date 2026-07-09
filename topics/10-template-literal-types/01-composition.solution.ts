/**
 * SOLUTION — Template literal composition & the cartesian product
 *
 * The template literal type uses backticks and `${ }` placeholders, exactly
 * like a runtime template string:
 *
 *   type T = `prefix-${S}`;
 *
 * Three rules that explain everything below:
 *
 *   1. Each `${ }` placeholder must be a `string`, `number`, `bigint`,
 *      `boolean`, `null`, or `undefined`. A bare `symbol` won't work. For a
 *      generic `S`, constrain it with `extends string` so the template is
 *      valid. (`${U & string}` is the idiom when `U` might hold non-string
 *      members — see Topic 09 for that pattern.)
 *
 *   2. If a placeholder is a **union of literals**, the template expands into
 *      the full cartesian product of all placeholder unions. Two binary
 *      unions => four strings. This is how tiny unions synthesise large route
 *      tables, event names, and CSS-key vocabularies.
 *
 *   3. Literal placeholders stay literal: `"ts"` stays `"ts"` (not widened to
 *      `string`), so `` `file:${"ts"}` `` is exactly `"file:ts"`.
 *
 *   ────────────────────────────────────────────────────────────────────────
 *   ⚠️ A common trap: if the interpolated value is the *generic parameter
 *      itself* (`S` constrained to `string`, with no concrete union), the
 *      template resolves to the broad `string` type, not a literal. The
 *      cartesian-product magic only fires for *concrete literal unions* at the
 *      call site — which is exactly what the CHECKS supply.
 *   ────────────────────────────────────────────────────────────────────────
 */

// explanation: prepend the literal "file:" to each member of F. Because F is a
// union of literals at the call site, this produces one string per member.
type Prefix<F extends string> = `file:${F}`;

// explanation: two placeholders, each a literal union. TS takes the product:
// {GET,POST} × {/users,/posts} => four "METHOD path" strings, space-separated.
type Route<M extends string, P extends string> = `${M} ${P}`;

// explanation: literal `[` and `]` scaffolding around each member of S. Same
// product rule — one output string per input member.
type Wrap<S extends string> = `[${S}]`;

import { assert, assertEquals, describe, expectTypeOf } from "@lib";

// CHECKS — compile-time.

// Prefix prepends "file:" to each extension literal:
expectTypeOf<Prefix<"ts" | "js">>().toEqualTypeOf<"file:ts" | "file:js">();

// Route is the cartesian product of methods × paths:
expectTypeOf<Route<"GET" | "POST", "/users" | "/posts">>().toEqualTypeOf<
  "GET /users" | "GET /posts" | "POST /users" | "POST /posts"
>();

// Wrap brackets each member:
expectTypeOf<Wrap<"a" | "b">>().toEqualTypeOf<"[a]" | "[b]">();

// A single-literal input still produces a single literal (no widening):
expectTypeOf<Prefix<"md">>().toEqualTypeOf<"file:md">();

// ── The "generic parameter, no literal union" case ──────────────────────────
// `Prefix<string>` (the generic, not a literal union) does NOT expand via the
// product rule — there are no members to enumerate. Instead it resolves to the
// template literal type `` `file:${string}` ``: a SUBTYPE of `string` (every
// value starts with "file:"), assignable to `string` but NOT identical to it.
type _PrefixStr = Prefix<string>;
expectTypeOf<_PrefixStr>().toExtend<string>();
expectTypeOf<_PrefixStr>().not.toEqualTypeOf<string>();
expectTypeOf<_PrefixStr>().toEqualTypeOf<`file:${string}`>();

// RUNTIME — the type-level cartesian product mirrors a value-level flatMap.
// We build the same `Route` strings at runtime and confirm they match.
function routes<M extends string, P extends string>(
  methods: readonly M[],
  paths: readonly P[],
): Route<M, P>[] {
  const out: Route<M, P>[] = [];
  for (const m of methods) {
    for (const p of paths) {
      // explanation: TS understands template-literal syntax at the value level
      // too, so `${m} ${p}` is inferred as the literal type `Route<M, P>`.
      out.push(`${m} ${p}` as Route<M, P>);
    }
  }
  return out;
}

describe("01-composition runtime checks", () => {
  const r = routes(
    ["GET", "POST"] as const,
    ["/users", "/posts"] as const,
  );
  assert(r.length === 4, "cartesian product has 4 entries");
  assertEquals(r, [
    "GET /users",
    "GET /posts",
    "POST /users",
    "POST /posts",
  ]);

  // Wrap at runtime mirrors the type-level Wrap:
  const wrapped = (["a", "b"] as const).map((s) => `[${s}]` as `[${typeof s}]`);
  assert(wrapped[0] === "[a]" && wrapped[1] === "[b]", "wrap brackets each");
});
