/**
 * PROMPT — Declaration merging & interface `extends`
 *
 * `interface` has a unique superpower: declare two interfaces with the SAME
 * name and TypeScript silently **merges** them into one. This is how library
 * authors let consumers augment a shape (e.g. adding a field to a framework's
 * `Window` or `App` type).
 *
 * Tasks:
 *   1. Below the TODO, declare a SECOND `Config` interface (same name!) that
 *      adds a `timeout: number` field. Do not modify the first one.
 *   2. Fix the CHECKS so they describe the TRUE merged shape of `Config`.
 *   3. Make `HttpConfig` `extends` `Config` and add a `baseURL: string` field,
 *      then fix its CHECKS too.
 *
 * Rules:
 *   - Do NOT change the first `interface Config` definition.
 *   - Use the `interface` keyword (a `type` alias cannot merge).
 *
 * Run:  npx tsc --noEmit 01-declaration-merging.problem.ts
 */

interface Config {
  retries: number;
}

// TODO: declare a second `interface Config` that adds `timeout: number`.

// TODO: declare `interface HttpConfig extends Config` adding `baseURL: string`.

import { expectTypeOf } from "@lib";

// CHECKS — fix these to reflect the merged + extended shapes.
expectTypeOf<Config>().toEqualTypeOf<{ retries: number }>(); // ❓ merged?
expectTypeOf<HttpConfig>().toEqualTypeOf<{ retries: number }>(); // ❓ extended?
