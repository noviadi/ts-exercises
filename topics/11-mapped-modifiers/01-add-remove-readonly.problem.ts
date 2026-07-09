/**
 * PROMPT — Add and remove `readonly` with mapped modifiers
 *
 * A mapped type iterates the keys of an object type. By default it KEEPS the
 * `readonly` modifier of each property. You can flip that with the `+`/`-`
 * modifier operators on the `[K in keyof T]` clause:
 *
 *     {  readonly [K in keyof T]: T[K] }   // === { +readonly [K ...] }: adds readonly
 *     { -readonly [K in keyof T]: T[K] }   // removes readonly (if present)
 *
 * Your job:
 *   1. Implement `Freeze<T>`   — adds `readonly` to every property.
 *   2. Implement `Mutable<T>`  — REMOVES `readonly` from every property.
 *
 * Replace the `TODO` stubs (currently `any`) with the real mapped types. The
 * CHECKS region must compile once you've got them right.
 *
 * Run:  npx tsc --noEmit 01-add-remove-readonly.problem.ts
 */

type Config = {
  readonly env: string;
  endpoint: string;
};

// TODO: implement these two mapped types.
type Freeze<T> = any; //  add  `readonly` to every key of T
type Mutable<T> = any; // remove `readonly` from every key of T

import { expectTypeOf } from "@lib";

// CHECKS — fail until you implement Freeze / Mutable correctly.

// A `Freeze<Config>` is fully readonly: even `endpoint` (originally mutable) is now readonly.
expectTypeOf<Freeze<Config>>().toEqualTypeOf<{
  readonly env: string;
  readonly endpoint: string;
}>();

// A `Mutable<Config>` is fully mutable: even `env` (originally readonly) is now writable.
expectTypeOf<Mutable<Config>>().toEqualTypeOf<{
  env: string;
  endpoint: string;
}>();
