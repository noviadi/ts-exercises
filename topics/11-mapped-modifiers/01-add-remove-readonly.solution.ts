/**
 * SOLUTION — Add and remove `readonly` with mapped modifiers
 *
 * The `[K in keyof T]` clause of a mapped type can carry a modifier prefix:
 *
 *     +readonly   adds readonly (this is what bare `readonly` does — `+` is the default)
 *     -readonly   removes readonly
 *
 * The `+` is rarely written explicitly because it is the default; the *useful*
 * operator is `-readonly`, which lets you strip immutability that an existing
 * type declared. This is exactly how `Mutable<T>` (a.k.a. `Writable<T>`) is
 * built in every TS utility library, and how the built-in `Readonly<T>` is the
 * inverse direction.
 */

import { expectTypeOf } from "@lib";

type Config = {
  readonly env: string;
  endpoint: string;
};

// explanation: `{ readonly [K in keyof T]: T[K] }` re-creates the shape but
// forces every property to be `readonly`. (This is identical to the built-in
// `Readonly<T>`.) The `readonly` keyword is sugar for `+readonly`.
type Freeze<T> = {
  readonly [K in keyof T]: T[K];
};

// explanation: `{ -readonly [K in keyof T]: T[K] }` strips the modifier. The
// minus sign is the heart of this exercise — without it, `readonly` keys would
// stay readonly, because a mapped type preserves modifiers by default.
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

// CHECKS — all pass.

// Freeze makes EVERY key readonly, including `endpoint` which was originally mutable:
expectTypeOf<Freeze<Config>>().toEqualTypeOf<{
  readonly env: string;
  readonly endpoint: string;
}>();

// Mutable makes EVERY key mutable, including `env` which was originally readonly:
expectTypeOf<Mutable<Config>>().toEqualTypeOf<{
  env: string;
  endpoint: string;
}>();

// Sanity: applying Freeze then Mutable collapses to "everything mutable",
// i.e. `Mutable<Config>` — NOT to `Config` itself, because `Config` has a
// readonly `env` that stripping would remove. So Freeze∘Mutable ≡ Mutable.
expectTypeOf<Mutable<Freeze<Config>>>().toEqualTypeOf<Mutable<Config>>();
// And the other direction collapses to "everything readonly" ≡ Freeze<Config>.
expectTypeOf<Freeze<Mutable<Config>>>().toEqualTypeOf<Freeze<Config>>();

// Runtime check: prove the types describe the same runtime value.
const frozen: Freeze<Config> = { env: "prod", endpoint: "/api" };
const mut: Mutable<Config> = { env: "prod", endpoint: "/api" };
mut.endpoint = "/v2"; // legal: Mutable stripped the readonly off `env` too
void frozen;
void mut;
