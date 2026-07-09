/**
 * PROMPT — Nominal brand with a `unique symbol`
 *
 * TypeScript is structurally typed, so `{ id: number }` for a user and an order
 * are the SAME type — you can pass an order id where a user id is expected.
 * Brands fix this: we intersect with a symbol-keyed marker that callers can't
 * accidentally construct.
 *
 * Your job:
 *   1. Replace the TODOs with proper `unique symbol` brands and branded
 *      `UserId` / `OrderId` aliases.
 *   2. Fix the CHECKS so they describe the TRUE (nominal) relationships.
 *   3. Add `// @ts-expect-error <reason>` above the lines that should error.
 *
 * Hint:
 *   - `type UserId = number & { readonly [__u]: true };`
 *     requires `__u` to be a `unique symbol` (Topic 29.01 explains why).
 *
 * Run:  npx tsc --noEmit 02-nominal-brand.problem.ts
 */

// TODO: declare TWO distinct unique symbols (one per brand).
// declare const __u: /* TODO */;
// declare const __o: /* TODO */;

// TODO: branded aliases over `number`.
// type UserId = /* TODO */;
// type OrderId = /* TODO */;

function getUser(id: UserId): UserId {
  return id;
}

import { expectTypeOf } from "@lib";

// CHECKS — make these describe reality.

// A plain `number` should NOT be assignable to `UserId`:
// getUser(42);
// expectTypeOf<number>().toExtend<UserId>();

// An `OrderId` should NOT be assignable to a `UserId` (different brands):
// expectTypeOf<OrderId>().toExtend<UserId>();

// But `UserId` IS still assignable to `number` (it carries its data payload):
// expectTypeOf<UserId>().toExtend<number>();
