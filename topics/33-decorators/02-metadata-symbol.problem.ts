/**
 * PROMPT — The `metadata` symbol convention
 *
 * Stage-3 decorators give every class a per-class **metadata bag** via
 * `ctx.metadata` (an empty plain object TS creates for you). Decorators stash
 * data on it; after class definition the bag is reachable as the
 * well-known-keyed static property `Class[Symbol.metadata]`.
 *
 * This is the modern replacement for the old `reflect-metadata` ecosystem —
 * no third-party runtime, no `experimentalDecorators`, no emit hook.
 *
 * Your job:
 *   1. Implement a `@tagged(name: string)` method decorator that pushes
 *      `name` onto `ctx.metadata.tags` (creating the array if absent).
 *   2. Implement `getTags(Class): readonly string[]` that reads the metadata
 *      back from `Class[Symbol.metadata]`.
 *   3. Apply `@tagged` to a couple of methods on `UserService` and verify via
 *      `getTags(UserService)` that the names are recorded.
 *
 * Hint — the standard idiom is:
 *
 *   (ctx.metadata.tags ??= []).push(name)
 *
 * Run:  npx tsc --noEmit 02-metadata-symbol.problem.ts
 */

// TODO: implement `tagged` and `getTags` below.

import { expectTypeOf } from "@lib";

class UserService {
  // @tagged("read")
  getUser(id: string): { id: string } {
    return { id };
  }

  // @tagged("read")
  listUsers(): { id: string }[] {
    return [];
  }

  // @tagged("write")
  saveUser(_u: { id: string }): void {}
}

// CHECKS — should pass once implemented.

// The metadata is reachable as the well-known symbol-keyed static property:
// expectTypeOf<ReturnType<typeof getTags>>().toExtend<readonly string[]>();
