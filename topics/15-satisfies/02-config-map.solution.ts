/**
 * SOLUTION — The config-map pattern
 *
 * The pattern: a heterogeneous map where every entry must pass a shared
 * constraint, but each entry should keep its own narrow literal types for
 * later exhaustive narrowing.
 *
 *   `const routes = { ... } satisfies Record<string, RouteConfig>`
 *
 * What each alternative would do:
 *
 *   - annotation `: Record<string, RouteConfig>`
 *       ➜ every `method` widens to `"GET" | "POST"`. Loses per-entry literals.
 *   - no annotation at all
 *       ➜ literals preserved, but typos like `methid: "GET"` aren't caught.
 *   - `satisfies Record<string, RouteConfig>`
 *       ➜ catches typos AND preserves each `method` literal. Win.
 *
 * For per-key constraints (e.g. a known set of route names) use a mapped type
 * as the `satisfies` target — see `RouteMap` below.
 */

import { assert, describe, expectTypeOf } from "@lib";

interface RouteConfig {
  path: string;
  method: "GET" | "POST";
}

// A mapped-type target gives us BOTH "known key set" AND per-entry literals.
type RouteMap = {
  home: RouteConfig;
  user: RouteConfig;
  create: RouteConfig;
};

const routes = {
  home: { path: "/", method: "GET" },
  user: { path: "/user", method: "GET" },
  create: { path: "/user", method: "POST" },
} satisfies RouteMap;

// CHECKS — every `method` keeps its exact literal thanks to `satisfies`.
expectTypeOf<typeof routes.home.method>().toEqualTypeOf<"GET">();
expectTypeOf<typeof routes.user.method>().toEqualTypeOf<"GET">();
expectTypeOf<typeof routes.create.method>().toEqualTypeOf<"POST">();

// The map as a whole still extends the structural constraint.
expectTypeOf<typeof routes>().toExtend<RouteMap>();

// Catch typos: a bad `method` literal is rejected by the check.
// @ts-expect-error  '"PUT"' is not assignable to '"GET" | "POST"'.
const bad = { home: { path: "/", method: "PUT" } } satisfies RouteMap;
void bad;

// Contrast: an annotation would have widened `method` to the union.
const widened: RouteMap = routes;
expectTypeOf<typeof widened.home.method>().toEqualTypeOf<"GET" | "POST">();

describe("config map: satisfies preserves literals", () => {
  assert(routes.home.method === "GET");
  assert(routes.create.method === "POST");
});
