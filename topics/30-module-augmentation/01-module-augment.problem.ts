/**
 * PROMPT — Augment a third-party module's types
 *
 * The `expect-type` package ships its own types, but we want to add a NEW
 * exported interface to it (e.g. a shared `KataMeta` shape our project uses).
 * Module augmentation lets us merge into the existing module surface without
 * forking the library.
 *
 * Your job:
 *   1. Write the `declare module "expect-type" { ... }` block that adds an
 *      exported `KataMeta` interface (see shape below).
 *   2. Replace the TODO import so the CHECKS compile.
 *
 * Rules:
 *   - Keep the augmentation INSIDE this file (it's already a module — it
 *     imports from `@lib`).
 *   - Use `import type` (verbatimModuleSyntax is ON) for the augmented member.
 *
 * Shape:
 *     interface KataMeta { name: string; difficulty: "easy" | "hard" }
 *
 * Run:  npx tsc --noEmit 01-module-augment.problem.ts
 */

import { expectTypeOf } from "@lib";

// TODO: declare module "expect-type" { export interface KataMeta { ... } }

// TODO: type-only import of the augmented member.
// import type { KataMeta } from "expect-type";

// CHECKS — the augmentation must widen expect-type's surface so this compiles.
// expectTypeOf<KataMeta>().toEqualTypeOf<{
//   name: string;
//   difficulty: "easy" | "hard";
// }>();
