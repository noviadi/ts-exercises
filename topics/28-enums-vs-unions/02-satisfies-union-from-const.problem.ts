/**
 * PROMPT — `satisfies` to validate a const object against a union
 *
 * A common need: "I have a union of allowed values; I want a const object
 * that maps each one to some data, and I want the compiler to ERROR if I
 * forget a case or invent an extra one."
 *
 * `satisfies` is the right tool. It constrains the object to a shape WITHOUT
 * widening the literal types of its values — exactly what we need to build
 * a refactor-safe lookup table over a union.
 *
 * Your job:
 *   1. Given the `Role` union, build a `ROLE_LABELS` const object that maps
 *      each role to a human-readable string, validated with `satisfies`.
 *   2. The check must FAIL TO COMPILE if you miss a role OR add an unknown
 *      one — that's the whole point.
 *   3. In the second half, read the comments on WHEN a real `enum` is
 *      defensible, and fix the failing assertion that documents the
 *      trade-off.
 *
 * Rules:
 *   - Keep runtime checks passing.
 *   - Use `import type` for type-only imports.
 *
 * Run:  npx tsc --noEmit 02-satisfies-union-from-const.problem.ts
 *       npx tsx           02-satisfies-union-from-const.problem.ts
 */

import { assert, describe, expectTypeOf } from "@lib";

// Source-of-truth union. The const object below must cover exactly this set.
type Role = "admin" | "editor" | "viewer";

// TODO: build `ROLE_LABELS` as a `Record<Role, string>` validated with
// `satisfies`. Use the pattern:
//
//   const ROLE_LABELS = { admin: "Admin", ... } satisfies Record<Role, string>;
//
const ROLE_LABELS = {} satisfies Record<Role, string>;

// TODO: prove the value types stay literal-narrow (or `string`, your call)
// and that adding a non-Role key would fail.

// CHECKS — make these pass.

describe("ROLE_LABELS covers each role", () => {
  // assert(ROLE_LABELS.admin === "Admin");
  // assert(ROLE_LABELS.editor === "Editor");
  // assert(ROLE_LABELS.viewer === "Viewer");
  assert(true, "placeholder — implement ROLE_LABELS");
});

// Type-level checks
// expectTypeOf<typeof ROLE_LABELS>().toExtend<Record<Role, string>>();
