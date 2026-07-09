/**
 * PROMPT — Module declarations & augmentation
 *
 * `declare module "name" { ... }` lets you describe the TYPE surface of a
 * module. Two flavours exist:
 *
 *   1. AMBIENT module declaration  — types a module the compiler has never seen
 *      (e.g. an untyped JS package). Requires a `.d.ts` file under modern
 *      `moduleResolution: "Bundler"`.
 *   2. Module AUGMENTATION         — MERGES new members into a module that
 *      already resolves. Works from inside a normal `.ts` module file.
 *
 * This exercise uses flavour (2): augment `@lib` (the project's own resolvable
 * module) with a NEW exported interface and function, and verify the
 * augmentation widens its surface.
 *
 * Your job:
 *   1. Write the `declare module "@lib" { ... }` block that adds:
 *        - `interface KataInfo { topic: number; name: string }`
 *        - `function kataVersion(): string`
 *   2. Replace the TODO `import type` so the CHECKS compile.
 *
 * Rules:
 *   - Keep the declaration INSIDE this file (it's already a module via `@lib`).
 *   - Use `import type` (verbatimModuleSyntax is ON).
 *
 * Run:  npx tsc --noEmit 02-module-declaration.problem.ts
 */

import { expectTypeOf } from "@lib";

// TODO: declare module "@lib" { export interface KataInfo {...} export function kataVersion(): string }

// TODO: type-only import of the augmented members.
// import type { KataInfo, kataVersion } from "@lib";

// CHECKS — the augmentation must widen @lib's surface so these compile.
// expectTypeOf<KataInfo>().toEqualTypeOf<{ topic: number; name: string }>();
// expectTypeOf<typeof kataVersion>().toBeCallableWith();
// expectTypeOf<ReturnType<typeof kataVersion>>().toBeString();
