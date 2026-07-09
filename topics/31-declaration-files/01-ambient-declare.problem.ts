/**
 * PROMPT — Ambient `declare const` / `declare function` / `declare class`
 *
 * Some values exist at runtime but not in TS's view of the world — globals set
 * by an HTML script, a function injected by a bundler, etc. `declare` lets you
 * promise the compiler they exist, WITHOUT emitting any code for them.
 *
 * Your job:
 *   1. Replace each TODO with the correct ambient declaration.
 *   2. Fix the CHECKS so they describe the declared shapes.
 *
 * Rules:
 *   - Do NOT provide real implementations. Ambient declarations are type-only;
 *     we deliberately have no runtime values here, so the checks are purely
 *     type-level (per the SPEC: runtime checks appear only where our file
 *     defines behaviour).
 *
 * Declarations to author:
 *   - `VERSION`    — a global string constant injected at build time.
 *   - `greet(name)` — a global function `(name: string) => string`.
 *   - `Counter`    — a global class with `count: number` and `increment(): void`.
 *
 * Run:  npx tsc --noEmit 01-ambient-declare.problem.ts
 */

import { expectTypeOf } from "@lib";

// TODO: declare const VERSION: ...
// TODO: declare function greet(...): ...
// TODO: declare class Counter { ... }

// CHECKS — describe the ambient shapes.
// expectTypeOf<typeof VERSION>().toBeString();
// expectTypeOf<typeof greet>().toBeCallableWith("alice");
// expectTypeOf<ReturnType<typeof greet>>().toBeString();
// expectTypeOf<Counter>().toBeConstructibleWith();
// expectTypeOf<InstanceType<typeof Counter>>().toExtend<{ count: number }>();
