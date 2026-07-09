/**
 * SOLUTION — Path strings & method/route unions with casing intrinsics
 *
 * The four intrinsic string-manipulation types are built into the compiler:
 *
 *   Uppercase<S>     — every code point uppercased
 *   Lowercase<S>     — every code point lowercased
 *   Capitalize<S>    — first code point uppercased, rest untouched
 *   Uncapitalize<S>  — first code point lowercased, rest untouched
 *
 * They are *real* type-level functions: given a literal input they return a
 * literal output (e.g. `Capitalize<"foo">` is exactly `"Foo"`), and given a
 * broad `string` they return `string` (or `Capitalize<string>` which still
 * widens to `string`).
 *
 * Plug them inside a template literal's `${ }` and you can synthesise entire
 * domain vocabularies (CSS variables, HTTP routes, event names) from a tiny
 * seed union — with every member a fully-known string literal the compiler can
 * check exhaustively.
 */

// explanation: glue a literal `style.` prefix onto each key in K. One
// placeholder, one literal union => one output per member.
type Dotted<K extends string> = `style.${K}`;

// explanation: two transformations stacked — first Uppercase the member
// ("color" -> "COLOR"), then prefix with the literal `--`. Order matters: we
// must uppercase BEFORE interpolating, because the `${ }` doesn't transform.
type CssVar<K extends string> = `--${Uppercase<K>}`;

// explanation: the cartesian product from 01, with the method uppercased.
// `Uppercase<M>` turns "get" -> "GET", then we splice a space and the path.
type HttpRoute<M extends string, P extends string> = `${Uppercase<M>} ${P}`;

import { assert, describe, assertEquals, expectTypeOf } from "@lib";

// CHECKS — compile-time.

// Dotted prefixes every key with the literal "style.":
expectTypeOf<Dotted<"width" | "height">>().toEqualTypeOf<
  "style.width" | "style.height"
>();

// CssVar uppercases then prefixes "--":
expectTypeOf<CssVar<"color" | "bg">>().toEqualTypeOf<"--COLOR" | "--BG">();

// HttpRoute uppercases the method and concatenates " " + path:
expectTypeOf<HttpRoute<"get" | "post", "/users">>().toEqualTypeOf<
  "GET /users" | "POST /users"
>();

// The casing intrinsics are exact on literals:
expectTypeOf<Capitalize<"fooBar">>().toEqualTypeOf<"FooBar">();
expectTypeOf<Uppercase<"abc">>().toEqualTypeOf<"ABC">();
expectTypeOf<Uncapitalize<"Foo">>().toEqualTypeOf<"foo">();

// RUNTIME — value-level CSS-variable names mirroring CssVar<K>. The shape is
// identical to the type-level version, just executed.
function cssVar<K extends string>(key: K): CssVar<K> {
  return `--${key.toUpperCase()}` as CssVar<K>;
}

describe("02-paths-and-casing runtime checks", () => {
  // CssVar round-trips for a concrete literal:
  const v = cssVar("color");
  assert(v === "--COLOR", "cssVar uppercases and prefixes");

  // Dotted is a pure string template at runtime too:
  const keys = ["width", "height"] as const;
  const dotted = keys.map((k) => `style.${k}` as `style.${typeof k}`);
  assertEquals(dotted, ["style.width", "style.height"]);

  // HttpRoute: uppercase the method, keep the path. Confirms the cartesian
  // product behaves the same at runtime as at the type level.
  const methods = ["get", "post"] as const;
  const route = "/users" as const;
  const http = methods.map(
    (m) => `${m.toUpperCase()} ${route}` as `${Uppercase<typeof m>} ${typeof route}`,
  );
  assertEquals(http, ["GET /users", "POST /users"]);
});
