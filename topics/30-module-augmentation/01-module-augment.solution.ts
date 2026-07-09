/**
 * SOLUTION — Augment a third-party module's types
 *
 * Module augmentation = declaration merging applied to an external module's
 * surface. You write `declare module "pkg" { ... }` in a file that is already a
 * module (this one is — it imports `@lib`), and the members inside the block
 * are MERGED into the named module's public types.
 *
 *   - You can ADD new exports (what we do here with `KataMeta`).
 *   - You can also extend EXISTING exported interfaces by re-declaring them.
 *
 * The augmentation is purely a TYPE change. Because we only reference `KataMeta`
 * as a type (`import type`), nothing needs to exist at runtime in the
 * `expect-type` package — the import is erased under `verbatimModuleSyntax`.
 */

import { expectTypeOf } from "@lib";

// explanation: merge into the installed `expect-type` module. The block below
// makes a NEW exported interface, `KataMeta`, available to any file that
// imports from "expect-type". Without this block, the import below errors with
// "Module 'expect-type' has no exported member 'KataMeta'".
declare module "expect-type" {
  export interface KataMeta {
    name: string;
    difficulty: "easy" | "hard";
  }
}

// explanation: type-only import — erased at compile time, so tsx never needs to
// resolve a runtime value from expect-type for this member. The augmentation
// above is what makes the import type-check.
import type { KataMeta } from "expect-type";

// CHECKS — prove the augmentation widened the module's surface.

// `KataMeta` is now visible from expect-type with exactly the shape we declared:
expectTypeOf<KataMeta>().toEqualTypeOf<{
  name: string;
  difficulty: "easy" | "hard";
}>();

// It is also assignable to a structurally identical type (sanity check that
// augmentation produced a real, normal interface — not something exotic):
expectTypeOf<KataMeta>().toExtend<{ name: string }>();
