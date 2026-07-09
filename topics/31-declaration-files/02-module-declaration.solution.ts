/**
 * SOLUTION — Module declarations & augmentation under modern resolution
 *
 * `declare module "name" { ... }` describes the public TYPE surface of a
 * module. There are two flavours, and the strictness of `moduleResolution:
 * "Bundler"` (this repo's setting) decides which one you're allowed to use:
 *
 *   1. AMBIENT module declaration  — declares a module the compiler has never
 *      seen. Classically how you type an untyped JS package.
 *   2. Module AUGMENTATION         — MERGES new members into a module that
 *      ALREADY resolves (has its own types). Used to extend a library.
 *
 * ⚠️ Under `moduleResolution: "Bundler"`, flavour (1) is REJECTED inside a
 * `.ts` file that is itself a module: TS treats every `declare module "x"` as
 * augmentation, and errors (TS2664) if "x" doesn't resolve to a real typed
 * module. To create a brand-new ambient module you must use a `.d.ts` file.
 * This exercise stays inside the `.solution.ts` (no `.d.ts`), so we use
 * flavour (2): augmenting a module that DOES resolve.
 *
 * We pick `@lib` — the project's own resolvable module — and add two new
 * exports to it: an interface and a function. The CHECKS prove the
 * augmentation genuinely widened `@lib`'s surface.
 */

import { expectTypeOf } from "@lib";

// explanation: `@lib` resolves (via tsconfig `paths`), so this is a valid
// AUGMENTATION. The members below are merged into the existing module's
// public types — they do not replace anything.
declare module "@lib" {
  // An ambient interface added to the module:
  export interface KataInfo {
    topic: number;
    name: string;
  }

  // An ambient function signature (no body) added to the module:
  export function kataVersion(): string;
}

// explanation: type-only import of the augmented members. Under
// `verbatimModuleSyntax` this is erased at runtime, so tsx never tries to call
// `kataVersion` (which has no real implementation — it's a type-only promise).
import type { KataInfo, kataVersion } from "@lib";

// CHECKS — prove the augmentation widened `@lib`'s surface.

// `KataInfo` is now an export of `@lib` with exactly the declared shape:
expectTypeOf<KataInfo>().toEqualTypeOf<{ topic: number; name: string }>();

// `kataVersion` is callable with no args and returns a string:
expectTypeOf<typeof kataVersion>().toBeCallableWith();
expectTypeOf<ReturnType<typeof kataVersion>>().toBeString();

// --- The constraint, demonstrated -----------------------------------------

// explanation: the line below tries to declare a BRAND-NEW ambient module
// ("untyped-lib" does not resolve to anything). Under Bundler resolution TS
// reads it as augmentation and emits TS2664. This is why typing a truly
// untyped package from inside a `.ts` module file is impossible — you need a
// real `.d.ts` for that.
// @ts-expect-error  TS2664: under moduleResolution Bundler, 'declare module "x"' for a non-resolvable module is treated as augmentation and rejected — use a .d.ts for brand-new ambient modules
declare module "untyped-lib" {
  export function add(a: number, b: number): number;
}

// 💡 Takeaway: reach for `declare module` AUGMENTATION (flavour 2) to extend
// resolvable modules from a normal `.ts` file. Reach for a `.d.ts` file only
// when you need flavour (1) — a brand-new ambient module for something the
// compiler cannot resolve at all.
