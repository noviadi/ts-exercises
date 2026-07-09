/**
 * PROMPT — The config-map pattern (where `satisfies` shines)
 *
 * A common shape: a map of named routes, each tagged with a `method`
 * discriminator. You want TWO things at once:
 *
 *   1. Every route must conform to a `RouteConfig` shape (catch typos).
 *   2. Each route's `method` should keep its narrow literal (`"GET"`, not
 *      `string`) so later code can branch on it exhaustively.
 *
 * A plain annotation `const routes: Record<string, RouteConfig>` widens every
 * `method` to `string`. `satisfies` keeps each entry literal.
 *
 * Your job:
 *   1. Apply `satisfies` (NOT an annotation) to `routes` so the shape is
 *      validated and `routes.home.method` stays `"GET"`.
 *   2. Predict what `routes.user.method` widens to under a *plain annotation*
 *      by reading the contrast CHECK.
 *
 * Run:  npx tsc --noEmit 02-config-map.problem.ts
 */

interface RouteConfig {
  path: string;
  method: "GET" | "POST";
}

// TODO: validate this against `Record<string, RouteConfig>` while preserving
//       each entry's literal `method`.
const routes = {
  home: { path: "/", method: "GET" },
  user: { path: "/user", method: "GET" },
  create: { path: "/user", method: "POST" },
};

import { expectTypeOf } from "@lib";

// CHECKS — literals must survive.
expectTypeOf<typeof routes.home.method>().toEqualTypeOf<"GET">();
expectTypeOf<typeof routes.create.method>().toEqualTypeOf<"POST">();
