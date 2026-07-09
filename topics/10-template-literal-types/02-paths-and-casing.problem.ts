/**
 * PROMPT — Path strings & method/route unions with casing intrinsics
 *
 * Template literal types combine with the four **intrinsic string-manipulation
 * types** to assemble structured string vocabularies:
 *
 *   - Uppercase<"abc">     => "ABC"     (whole string uppercased)
 *   - Lowercase<"ABC">     => "abc"
 *   - Capitalize<"abc">    => "Abc"     (first letter only)
 *   - Uncapitalize<"Abc">  => "abc"
 *
 * Combined with template literals, you can build typed path strings and
 * HTTP-style "METHOD /route" unions whose every member is a known literal.
 *
 * Your job:
 *   1. Implement `Dotted<K>` — given a literal-union key set like
 *      `"width" | "height"`, produce `"style.width" | "style.height"`.
 *   2. Implement `CssVar<K>`  — turn `"color" | "bg"` into
 *      `"--COLOR" | "--BG"` (uppercase, then prefix `--`).
 *   3. Implement `HttpRoute<M, P>` — turn `"get" | "post"` × `"/users"` into
 *      `"GET /users" | "POST /users"` (method uppercased, route as-is).
 *
 * Hints:
 *   - `Uppercase<S>` and `Capitalize<S>` take a `string`; constrain generics
 *     with `extends string`.
 *   - The cartesian product from 01 still applies: two literal-union
 *     placeholders => all combinations.
 *
 * Run:  npx tsc --noEmit 02-paths-and-casing.problem.ts
 */

// TODO: replace each `any`.
type Dotted<K extends string> = any;
type CssVar<K extends string> = any;
type HttpRoute<M extends string, P extends string> = any;

import { expectTypeOf } from "@lib";

// CHECKS — fail until correct.
expectTypeOf<Dotted<"width" | "height">>().toEqualTypeOf<
  "style.width" | "style.height"
>();
expectTypeOf<CssVar<"color" | "bg">>().toEqualTypeOf<"--COLOR" | "--BG">();
expectTypeOf<HttpRoute<"get" | "post", "/users">>().toEqualTypeOf<
  "GET /users" | "POST /users"
>();
