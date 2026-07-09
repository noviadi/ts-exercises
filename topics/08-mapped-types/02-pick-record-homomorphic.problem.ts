/**
 * PROMPT — Rebuild `Pick` and `Record`, and observe homomorphism
 *
 * Two more of TS's built-in helpers are just mapped types in disguise:
 *
 *   - Pick<T, K>    — keep only the keys in K, with their original value types
 *   - Record<K, V>  — an object whose keys are K and whose values are all V
 *
 * Their definitions:
 *
 *   type Pick<T, K extends keyof T>   = { [P in K]: T[P] };
 *   type Record<K extends keyof any, V> = { [P in K]: V };
 *
 * The interesting wrinkle: when you map over `keyof T` (or a type parameter
 * constrained to `keyof T`), TS calls the mapped type **homomorphic** and it
 * *silently preserves the source's `readonly` / `?` modifiers*. Map over a
 * plain union of strings and that preservation disappears.
 *
 * Your job:
 *   1. Implement `MyPick<T, K>` and `MyRecord<K, V>`.
 *   2. Read the CHECKS — note which ones assert modifier preservation and
 *      reason about why they hold.
 *
 * Run:  npx tsc --noEmit 02-pick-record-homomorphic.problem.ts
 */

type Config = { retries: number; timeout: number; host: string };
type Optional = { a?: string; b: number };

// TODO: replace `any` with the real implementations.
type MyPick<T, K extends keyof T> = any;
type MyRecord<K extends keyof any, V> = any;

import { expectTypeOf } from "@lib";

// CHECKS — fail until MyPick / MyRecord are implemented correctly.
expectTypeOf<MyPick<Config, "retries" | "timeout">>().toEqualTypeOf<{
  retries: number;
  timeout: number;
}>();
expectTypeOf<MyRecord<"a" | "b", number>>().toEqualTypeOf<{ a: number; b: number }>();
// homomorphic preservation: MyPick over an optional key keeps the `?`.
expectTypeOf<MyPick<Optional, "a">>().toEqualTypeOf<{ a?: string }>();
