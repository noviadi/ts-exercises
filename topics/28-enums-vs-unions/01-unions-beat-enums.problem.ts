/**
 * PROMPT — Why literal unions beat enums
 *
 * Below, `StatusEnum` is a string enum and `STATUS`/`Status` is its
 * `as const` union equivalent. The exercise has three parts:
 *
 *   1. Inspect the runtime cost: the enum emits an object; the union emits
 *      nothing. (You can see this in the `describe` checks below.)
 *   2. Spot the reverse-mapping behaviour on *numeric* enums — and the type
 *      hole it creates.
 *   3. Rewrite the enum as an `as const` object + `keyof typeof` union and
 *      make every CHECK pass.
 *
 * Rules:
 *   - Keep the runtime `describe`/`assert` checks; make them pass.
 *   - Use `import type` for type-only imports.
 *
 * Run:  npx tsc --noEmit 01-unions-beat-enums.problem.ts
 *       npx tsx           01-unions-beat-enums.problem.ts
 */

import { assert, describe, expectTypeOf } from "@lib";

// A string enum. Notice this is ALSO a runtime value (an object).
enum StatusEnum {
  Idle = "IDLE",
  Loading = "LOADING",
  Done = "DONE",
}

// TODO: rewrite as `as const` object + union type. Use this template:
//
//   const STATUS = { Idle: "IDLE", Loading: "LOADING", Done: "DONE" } as const;
//   type Status = (typeof STATUS)[keyof typeof STATUS];
//
const STATUS = {}; // TODO
type Status = string; // TODO

// A numeric enum, to demonstrate the reverse-map gotcha:
enum Priority {
  Low = 1,
  High = 2,
}

// CHECKS — make these pass.

describe("string enum emits a runtime object", () => {
  assert(StatusEnum.Loading === "LOADING");
  // The enum exists at runtime as a real object:
  assert(typeof StatusEnum === "object");
});

describe("as const union is tree-shakeable", () => {
  // TODO: replace `unknown` so this checks that STATUS.Loading === "LOADING".
  assert((STATUS as { Loading: "LOADING" }).Loading === "LOADING");
});

describe("numeric enums have a reverse map", () => {
  // Numeric enums map value -> name back:
  assert(Priority[1] === "Low", "reverse mapping: Priority[1] === 'Low'");
  // ⚠ This means Priority is a much bigger object than you might expect.
});

describe("the union participates in keyof typeof", () => {
  // TODO: prove that `keyof typeof STATUS` is the set of object keys, and
  // that `Status` is the union of values.
  // (Use expectTypeOf in the CHECKS region below.)
  assert(true);
});

// Type-level checks
expectTypeOf<StatusEnum>().toEqualTypeOf<StatusEnum>(); // identity sanity
// TODO: assert Status === "IDLE" | "LOADING" | "DONE"
// expectTypeOf<Status>().toEqualTypeOf<"IDLE" | "LOADING" | "DONE">();
