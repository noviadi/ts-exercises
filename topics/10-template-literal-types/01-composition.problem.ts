/**
 * PROMPT — Template literal composition & the cartesian product
 *
 * A template literal type has the same shape as a JS template string, but in
 * type space:
 *
 *   type T = `https://${Host}/${Path}`;
 *
 * The headline feature: when you interpolate a **union of string literals**,
 * TypeScript expands the template into every combination — the cartesian
 * product. So:
 *
 *   type Methods = "GET" | "POST";
 *   type Paths   = "/users" | "/posts";
 *   type Route   = `${Methods} ${Paths}`;
 *   // => "GET /users" | "GET /posts" | "POST /users" | "POST /posts"
 *
 * Your job:
 *   1. Implement `Prefix<F>`  — given a string literal union `F` of file
 *      extensions (`"ts" | "js"`), produce `"file:ts" | "file:js"`.
 *   2. Implement `Route<M, P>` — the method+path cartesian product above.
 *   3. Implement `Wrap<S>`    — wrap each member of `S` in square brackets:
 *      `Wrap<"a" | "b">` => `"[a]" | "[b]"`.
 *
 * Hints:
 *   - The placeholders must each be a `string` (or `number`). If you accept a
 *     generic `S`, constrain it with `extends string` so the template is valid.
 *   - A union interpolates as the full product — no extra work required.
 *
 * Run:  npx tsc --noEmit 01-composition.problem.ts
 */

// TODO: replace each `any` with a template literal type.
type Prefix<F extends string> = any;
type Route<M extends string, P extends string> = any;
type Wrap<S extends string> = any;

import { expectTypeOf } from "@lib";

// CHECKS — fail until the three types are correct.
expectTypeOf<Prefix<"ts" | "js">>().toEqualTypeOf<"file:ts" | "file:js">();
expectTypeOf<Route<"GET" | "POST", "/users" | "/posts">>().toEqualTypeOf<
  "GET /users" | "GET /posts" | "POST /users" | "POST /posts"
>();
expectTypeOf<Wrap<"a" | "b">>().toEqualTypeOf<"[a]" | "[b]">();
