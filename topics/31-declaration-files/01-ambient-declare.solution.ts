/**
 * SOLUTION — Ambient `declare const` / `declare function` / `declare class`
 *
 * `declare` is a TYPE-LEVEL promise: "trust me, this value exists at runtime".
 * The compiler records the shape you give it and emits NO JavaScript for the
 * declaration itself. This is how you type:
 *
 *   - globals injected by a `<script>` tag or a bundler define plugin;
 *   - functions/classes from a legacy JS file you can't or won't rewrite;
 *   - anything in a `.d.ts` file (here we keep it in a normal `.ts` module
 *     so the exercise is self-contained).
 *
 * Three flavours:
 *
 *   `declare const x`       — a single value with a known type.
 *   `declare function f`    — a callable value with a signature (no body).
 *   `declare class C`       — a constructable value with a shape (no bodies).
 *
 * All three are TYPE-ONLY. We don't call them at runtime here because our file
 * doesn't provide the real implementations — these are ambient promises only.
 */

// explanation: `declare const` — runtime provides this; we only state its type.
// Build-time injected version string (think: bundler's `define`).
declare const VERSION: string;

// explanation: `declare function` — ambient signature with no body. The
// compiler now treats `greet` as a value with this call signature.
declare function greet(name: string): string;

// explanation: `declare class` — ambient class shape. Method bodies are
// omitted; only the type contract matters.
declare class Counter {
  count: number;
  increment(): void;
}

import { expectTypeOf } from "@lib";

// CHECKS — the ambient shapes are now visible to the type system.

// `VERSION` is a string value:
expectTypeOf<typeof VERSION>().toBeString();

// `greet` is callable with a string and returns a string. We use the TYPE
// query form `typeof greet` rather than passing `greet` as a value, because
// `greet` is AMBIENT — it has no runtime existence, so referencing it as a
// value would throw at runtime. The type query is erased by the compiler.
expectTypeOf<typeof greet>().toBeCallableWith("alice");
expectTypeOf<ReturnType<typeof greet>>().toBeString();

// `Counter` is constructible with no required args (same type-query reason):
expectTypeOf<typeof Counter>().toBeConstructibleWith();

// Its instances expose `count: number` and an `increment` method:
expectTypeOf<InstanceType<typeof Counter>>().toExtend<{
  count: number;
  increment(): void;
}>();

// Note we use `toBeConstructibleWith` (not `toBeFunction`) for `Counter`: a
// constructor type carries CONSTRUCT signatures, not call signatures, so
// `expectTypeOf<typeof Counter>().toBeFunction()` would be rejected. The
// `new` form above already exercises the construct signature.

